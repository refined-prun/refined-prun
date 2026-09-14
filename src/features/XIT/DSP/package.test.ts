import { describe, expect, it } from 'vitest';
import { buildDispatchPackage, getDispatchError, DispatchBase } from './package';
import { mergeBills } from '@src/features/XIT/ACT/material-bill';

function createBase(naturalId: string, shipId = 'ship1'): DispatchBase {
  return {
    naturalId,
    planetName: `Planet ${naturalId}`,
    config: {
      ship: shipId,
      resupply: true,
      repair: false,
      days: 10,
      repThreshold: 55,
      repAdvance: 1,
      materialFilter: 'All',
      cxBuy: true,
      offloadJson: false,
      agent: false,
    },
    bill: { RAT: { quantity: 100 } },
    ship: {
      id: shipId,
      name: shipId,
      exchangeCode: 'AI1',
      origin: 'Antares Warehouse',
      dest: `${shipId} Cargo`,
    },
  };
}

describe('dispatch readiness', () => {
  it.each(['bill', 'ship', 'origin', 'dest'] as const)(
    'blocks the whole dispatch until the second base has its %s',
    missing => {
      const ready = createBase('A');
      const pending = createBase('B');
      const saved = structuredClone(pending);
      if (missing === 'bill' || missing === 'ship') {
        pending[missing] = undefined;
      } else {
        pending.ship![missing] = undefined;
      }

      expect(getDispatchError([ready, pending])).toBeDefined();
      expect(buildDispatchPackage([ready, pending])).toBeUndefined();

      Object.assign(pending, saved);
      expect(getDispatchError([ready, pending])).toBeUndefined();
      const pkg = buildDispatchPackage([ready, pending])!;
      expect(pkg.groups.filter(x => x.planet).map(x => x.planet)).toEqual(['A', 'B']);
      expect(pkg.groups.find(x => x.name === 'Load ship1')!.materials).toEqual({ RAT: 200 });
    },
  );

  it('allows a loaded, empty bill without adding a stop for it', () => {
    const empty = createBase('B');
    empty.bill = {};
    const bases = [createBase('A'), empty];
    expect(getDispatchError(bases)).toBeUndefined();
    expect(
      buildDispatchPackage(bases)!
        .groups.filter(x => x.planet)
        .map(x => x.planet),
    ).toEqual(['A']);
  });

  it('does not stage a package with no selected bases or no material needs', () => {
    const empty = createBase('A');
    empty.bill = {};
    expect(buildDispatchPackage([])).toBeUndefined();
    expect(getDispatchError([empty])).toBe('No materials need to be dispatched');
    expect(buildDispatchPackage([empty])).toBeUndefined();
  });
});

describe('buildDispatchPackage', () => {
  it('loads every ship before finishing, with multi-stop ships first and stops in list order', () => {
    const single = createBase('A', 'single');
    const first = createBase('C', 'multi');
    const second = createBase('B', 'multi');
    first.config.agent = true;
    second.config.agent = true;
    second.config.offloadJson = true;
    second.config.repair = true;
    const refuel: UserData.ActionData = {
      type: 'Refuel',
      name: 'Refuel',
      origin: 'All Exchanges',
      buyMissingFuel: true,
    };
    const pkg = buildDispatchPackage([single, first, second], refuel)!;
    expect(pkg.actions.map(x => x.name)).toEqual([
      'Refuel',
      'Buy AI1',
      'Load multi',
      'Load single',
      'Offload multi',
      'Offload single',
    ]);
    expect(pkg.actions.filter(x => x.noSfc).map(x => x.dest)).toEqual([
      'multi Cargo',
      'single Cargo',
    ]);
    expect(pkg.actions.find(x => x.name === 'Offload multi')).toMatchObject({
      finishOnly: true,
      sfcDestination: 'C',
      agentGroups: ['Planet C', 'Planet B'],
      offloadGroups: ['Planet B'],
      repairGroups: ['Planet B'],
    });
    expect(pkg.groups.find(x => x.name === 'Load multi')!.materials).toEqual({ RAT: 200 });
  });

  it('aggregates purchases by exchange while loading bills with BUY disabled', () => {
    const first = createBase('A');
    const second = createBase('B');
    second.config.cxBuy = false;
    const third = createBase('C', 'ship2');
    third.ship!.exchangeCode = 'IC1';
    third.ship!.origin = 'Hortus Warehouse';
    const fourth = createBase('D', 'ship2');
    fourth.ship = { ...third.ship! };
    const bases = [first, second, third, fourth];
    const before = structuredClone(bases);
    const pkg = buildDispatchPackage(bases)!;

    expect(pkg.actions.filter(x => x.type === 'CX Buy').map(x => x.exchange)).toEqual([
      'AI1',
      'IC1',
    ]);
    expect(pkg.groups.find(x => x.name === 'Buy AI1')!.materials).toEqual({ RAT: 100 });
    expect(pkg.groups.find(x => x.name === 'Buy IC1')!.materials).toEqual({ RAT: 200 });
    expect(pkg.groups.find(x => x.name === 'Load ship1')!.materials).toEqual({ RAT: 200 });
    expect(pkg.actions.some(x => x.type === 'Refuel')).toBe(false);
    expect(bases).toEqual(before);
    pkg.groups.find(x => x.name === 'Planet A')!.materials!.RAT = 1;
    expect(first.bill).toEqual({ RAT: { quantity: 100 } });
  });
});

describe('mergeBills', () => {
  it('adds quantities and preserves metadata without sharing input entries', () => {
    const a = { RAT: { quantity: 100, price: 12 }, DW: { quantity: 20 } };
    const b = { RAT: { quantity: 50 }, PE: { quantity: 10, price: 5 } };
    const before = structuredClone([a, b]);
    const result = mergeBills(a, b)!;
    expect(result).toEqual({
      RAT: { quantity: 150, price: 12 },
      DW: { quantity: 20 },
      PE: { quantity: 10, price: 5 },
    });
    result.RAT.quantity = 0;
    result.DW.quantity = 0;
    result.PE.quantity = 0;
    expect([a, b]).toEqual(before);
  });

  it('keeps missing bills distinct from empty bills and copies a single input', () => {
    expect(mergeBills(undefined, undefined)).toBeUndefined();
    expect(mergeBills({}, undefined)).toEqual({});
    expect(mergeBills(undefined, {})).toEqual({});
    const bill = { RAT: { quantity: 100 } };
    for (const result of [mergeBills(bill, undefined)!, mergeBills(undefined, bill)!]) {
      expect(result).toEqual(bill);
      result.RAT.quantity = 0;
    }
    expect(bill.RAT.quantity).toBe(100);
  });
});
