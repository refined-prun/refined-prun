import { describe, expect, it, vi } from 'vitest';

// The cx module registers a dayjs plugin at import time that the app entry point normally
// installs; calculateMaterialFlow takes its prices as an argument and never calls it.
vi.mock('@src/infrastructure/fio/cx', () => ({
  getMarketPrices: () => ({ buy: undefined, sell: undefined }),
}));

import { calculateMaterialFlow, FlowPrices } from '@src/core/flow';
import { MaterialBurn, PlanetBurn } from '@src/core/burn';

function burn(values: Partial<MaterialBurn>): MaterialBurn {
  return {
    input: 0,
    output: 0,
    workforce: 0,
    dailyAmount: 0,
    remainingAllocation: 0,
    inventory: 0,
    inboundInventory: 0,
    daysLeft: 0,
    type: 'input',
    ...values,
  };
}

function planet(naturalId: string, planetName: string, values: Record<string, MaterialBurn>) {
  return { storeId: naturalId, planetName, naturalId, burn: values } satisfies PlanetBurn;
}

function prices(table: Record<string, { buy?: number; sell?: number }>) {
  return (ticker: string): FlowPrices => ({
    buy: table[ticker]?.buy,
    sell: table[ticker]?.sell,
    buyOverride: false,
    sellOverride: false,
  });
}

const noPrices = prices({});

describe('calculateMaterialFlow', () => {
  it('sums production and consumption across planets, counting workforce as consumption', () => {
    const flows = calculateMaterialFlow(
      [
        planet('OT-580b', 'Montem', { RAT: burn({ output: 10, workforce: 4 }) }),
        planet('UV-351a', 'Promitor', { RAT: burn({ input: 3, workforce: 2 }) }),
      ],
      noPrices,
    );

    expect(flows).toHaveLength(1);
    const rat = flows[0];
    expect(rat.ticker).toBe('RAT');
    expect(rat.production).toBe(10);
    expect(rat.consumption).toBe(9);
    expect(rat.delta).toBe(1);
  });

  it('records producers and consumers per planet, sorted by amount', () => {
    const flows = calculateMaterialFlow(
      [
        planet('A', 'Small', { RAT: burn({ output: 1, input: 5 }) }),
        planet('B', 'Big', { RAT: burn({ output: 9, input: 2 }) }),
      ],
      noPrices,
    );

    expect(flows[0].producers.map(x => [x.planetName, x.amount])).toEqual([
      ['Big', 9],
      ['Small', 1],
    ]);
    expect(flows[0].consumers.map(x => [x.planetName, x.amount])).toEqual([
      ['Small', 5],
      ['Big', 2],
    ]);
  });

  it('omits a planet from producers or consumers when its contribution is zero', () => {
    const flows = calculateMaterialFlow(
      [
        planet('A', 'Producer', { RAT: burn({ output: 4 }) }),
        planet('B', 'Consumer', { RAT: burn({ input: 4 }) }),
      ],
      noPrices,
    );

    expect(flows[0].producers.map(x => x.planetName)).toEqual(['Producer']);
    expect(flows[0].consumers.map(x => x.planetName)).toEqual(['Consumer']);
  });

  it('drops materials with neither production nor consumption', () => {
    const flows = calculateMaterialFlow([planet('A', 'Idle', { RAT: burn({}) })], noPrices);
    expect(flows).toEqual([]);
  });

  it('values a deficit at the buy price and a surplus at the sell price', () => {
    const table = prices({ RAT: { buy: 100, sell: 60 }, DW: { buy: 100, sell: 60 } });
    const flows = calculateMaterialFlow(
      [planet('A', 'Montem', { RAT: burn({ input: 2 }), DW: burn({ output: 3 }) })],
      table,
    );

    const rat = flows.find(x => x.ticker === 'RAT')!;
    const dw = flows.find(x => x.ticker === 'DW')!;
    expect(rat.delta).toBe(-2);
    expect(rat.currencyDelta).toBe(-200);
    expect(dw.delta).toBe(3);
    expect(dw.currencyDelta).toBe(180);
  });

  it('values a balanced material at zero using the sell price', () => {
    const flows = calculateMaterialFlow(
      [
        planet('A', 'Producer', { RAT: burn({ output: 5 }) }),
        planet('B', 'Consumer', { RAT: burn({ input: 5 }) }),
      ],
      prices({ RAT: { buy: 100, sell: 60 } }),
    );

    expect(flows[0].delta).toBe(0);
    expect(flows[0].currencyDelta).toBe(0);
  });

  it('leaves the value undefined when the relevant side has no price', () => {
    const flows = calculateMaterialFlow(
      [planet('A', 'Montem', { RAT: burn({ input: 2 }), DW: burn({ output: 3 }) })],
      prices({ RAT: { sell: 60 }, DW: { buy: 100 } }),
    );

    expect(flows.find(x => x.ticker === 'RAT')!.currencyDelta).toBeUndefined();
    expect(flows.find(x => x.ticker === 'DW')!.currencyDelta).toBeUndefined();
  });

  it('carries the override flags through to the row', () => {
    const flows = calculateMaterialFlow(
      [planet('A', 'Montem', { RAT: burn({ output: 1 }) })],
      () => ({
        buy: 1,
        sell: 2,
        buyOverride: false,
        sellOverride: true,
      }),
    );

    expect(flows[0].buyOverride).toBe(false);
    expect(flows[0].sellOverride).toBe(true);
  });
});
