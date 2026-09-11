import { describe, expect, it } from 'vitest';
import { calculatePlanetBurn, clampNearZeroDailyAmount, computeNeed } from '@src/core/burn';

describe('clampNearZeroDailyAmount', () => {
  it('does not clamp rates at or beyond the threshold', () => {
    expect(clampNearZeroDailyAmount(-0.01)).toBe(-0.01);
    expect(clampNearZeroDailyAmount(0.01)).toBe(0.01);
    expect(clampNearZeroDailyAmount(-0.011)).toBe(-0.011);
  });

  it('passes zero and infinity through unchanged', () => {
    expect(clampNearZeroDailyAmount(0)).toBe(0);
    expect(clampNearZeroDailyAmount(Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY);
    expect(clampNearZeroDailyAmount(Number.NEGATIVE_INFINITY)).toBe(Number.NEGATIVE_INFINITY);
  });
});

const currency: PrunApi.Currency = { numericCode: 1, code: 'ICA', name: 'ICA', decimals: 2 };
const amount: PrunApi.CurrencyAmount = { currency: 'ICA', amount: 0 };

function material(ticker: string): PrunApi.Material {
  return {
    name: ticker.toLowerCase(),
    id: `material-${ticker}`,
    ticker,
    category: 'consumables',
    weight: 1,
    volume: 1,
    resource: false,
  };
}

function productionLine(ticker: string, perDay: number): PrunApi.ProductionLine {
  return {
    id: `line-${ticker}`,
    siteId: 'site-1',
    address: { lines: [] },
    type: 'FRM',
    capacity: 1,
    slots: 1,
    efficiency: 1,
    condition: 1,
    workforces: [],
    orders: [
      {
        id: `order-${ticker}`,
        productionLineId: `line-${ticker}`,
        inputs: [],
        outputs: [{ value: amount, material: material(ticker), amount: perDay }],
        created: { timestamp: 0 },
        started: null,
        completion: null,
        duration: { millis: 86400000 },
        lastUpdated: null,
        completed: 0,
        halted: false,
        productionFee: amount,
        productionFeeCollector: { currency },
        recurring: true,
        recipeId: `recipe-${ticker}`,
      },
    ],
    productionTemplates: [],
    efficiencyFactors: [],
  };
}

function need(ticker: string, unitsPerInterval: number, remainingAllocation: number): PrunApi.Need {
  return {
    category: 'FOOD',
    essential: true,
    material: material(ticker),
    satisfaction: 1,
    unitsPerInterval,
    unitsPer100: unitsPerInterval,
    remainingAllocation,
  };
}

function workforce(level: string, needs: PrunApi.Need[]): PrunApi.Workforce {
  return {
    level,
    population: 100,
    reserve: 0,
    capacity: 100,
    required: 100,
    satisfaction: 1,
    needs,
  };
}

describe('calculatePlanetBurn', () => {
  it('keeps inbound cargo separate while including it in days left and resupply needs', () => {
    const store = (amount: number) =>
      ({ items: [{ quantity: { material: material('RAT'), amount } }] }) as PrunApi.Store;
    const burn = calculatePlanetBurn(
      undefined,
      [workforce('PIONEER', [need('RAT', 10, 5)])],
      [store(10)],
      [store(20), store(30)],
    );

    expect(burn.RAT.inventory).toBe(10);
    expect(burn.RAT.inboundInventory).toBe(50);
    expect(burn.RAT.remainingAllocation).toBe(5);
    expect(burn.RAT.daysLeft).toBe(6.5);
    expect(computeNeed(burn.RAT, 10)).toBe(35);
  });

  it('adds allocations for the same material across workforce levels', () => {
    const burn = calculatePlanetBurn(
      undefined,
      [workforce('PIONEER', [need('RAT', 10, 20)]), workforce('SETTLER', [need('RAT', 20, 40)])],
      undefined,
    );
    expect(burn.RAT.remainingAllocation).toBe(60);
    expect(burn.RAT.daysLeft).toBe(2);
  });

  it('does not report 0 days left for a material whose production and consumption cancel', () => {
    // 0.3 produced against 0.1 + 0.2 consumed: the same value, one ULP apart.
    const burn = calculatePlanetBurn(
      [productionLine('RAT', 0.3)],
      [
        workforce('PIONEER', [need('RAT', 0.1, 0)]),
        workforce('SETTLER', [need('RAT', 0.2, 0), need('DW', 12.5, 250)]),
      ],
      undefined,
    );

    expect(burn.RAT.output - burn.RAT.workforce).toBe(-5.551115123125783e-17);
    expect(burn.RAT.dailyAmount).toBe(0);
    expect(burn.RAT.daysLeft).toBe(Number.POSITIVE_INFINITY);
  });

  it('still reports finite days left for a material actually being consumed', () => {
    const burn = calculatePlanetBurn(
      undefined,
      [workforce('SETTLER', [need('DW', 12.5, 250)])],
      undefined,
    );

    expect(burn.DW.dailyAmount).toBe(-12.5);
    expect(burn.DW.inboundInventory).toBe(0);
    expect(burn.DW.daysLeft).toBe(20);
  });
});
