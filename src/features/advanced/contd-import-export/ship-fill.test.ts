import { describe, expect, it } from 'vitest';
import { SHIP_BAYS, SizeLookup, bayUsage, cargoLoad, fillBay } from './ship-fill';

const sizes: Record<string, { weight: number; volume: number }> = {
  // Dense: 1 t per 0.5 m³.
  FE: { weight: 1, volume: 0.5 },
  // Light and bulky: 0.1 t per 1 m³.
  PE: { weight: 0.1, volume: 1 },
  // Tiny per-unit values summed as floats.
  MCG: { weight: 0.001, volume: 0.001 },
};
const size: SizeLookup = ticker => sizes[ticker];
const bay = (label: string) => SHIP_BAYS.find(x => x.label === label)!;

describe('fillBay', () => {
  it('stops at the weight limit for dense cargo', () => {
    // WCB 3000 t / 1000 m³: 3000 FE would need 1500 m³, so volume binds at 2000 FE.
    expect(fillBay(bay('WCB'), [], [{ ticker: 'FE', quantity: 10000 }], size)).toEqual([
      { ticker: 'FE', amount: 2000 },
    ]);
    // LCB 2000 t / 2000 m³: weight binds at 2000 FE.
    expect(fillBay(bay('LCB'), [], [{ ticker: 'FE', quantity: 10000 }], size)).toEqual([
      { ticker: 'FE', amount: 2000 },
    ]);
  });

  it('stops at the volume limit for bulky cargo', () => {
    expect(fillBay(bay('WCB'), [], [{ ticker: 'PE', quantity: 10000 }], size)).toEqual([
      { ticker: 'PE', amount: 1000 },
    ]);
  });

  it('never adds more than the dragged stack', () => {
    expect(fillBay(bay('HCB'), [], [{ ticker: 'FE', quantity: 120 }], size)).toEqual([
      { ticker: 'FE', amount: 120 },
    ]);
  });

  it('counts the materials already listed', () => {
    // 1000 FE already use 1000 t and 500 m³ of the LCB.
    const existing = [{ ticker: 'FE', amount: 1000 }];
    expect(fillBay(bay('LCB'), existing, [{ ticker: 'PE', quantity: 10000 }], size)).toEqual([
      { ticker: 'PE', amount: 1500 },
    ]);
  });

  it('fills several dragged stacks in order', () => {
    const added = fillBay(
      bay('LCB'),
      [],
      [
        { ticker: 'FE', quantity: 1500 },
        { ticker: 'PE', quantity: 10000 },
      ],
      size,
    );
    // FE uses 1500 t / 750 m³; PE then gets min(500 t / 0.1, 1250 m³ / 1) = 1250.
    expect(added).toEqual([
      { ticker: 'FE', amount: 1500 },
      { ticker: 'PE', amount: 1250 },
    ]);
  });

  it('adds nothing to a full bay and skips unknown materials', () => {
    const full = [{ ticker: 'FE', amount: 2000 }];
    expect(fillBay(bay('LCB'), full, [{ ticker: 'FE', quantity: 5 }], size)).toEqual([]);
    expect(fillBay(bay('LCB'), [], [{ ticker: 'XXX', quantity: 5 }], size)).toEqual([]);
  });

  it('is not thrown off by float rounding', () => {
    expect(fillBay(bay('LCB'), [], [{ ticker: 'MCG', quantity: 5_000_000 }], size)).toEqual([
      { ticker: 'MCG', amount: 2_000_000 },
    ]);
  });
});

describe('bayUsage', () => {
  it('reports the tighter of weight and volume', () => {
    const load = cargoLoad([{ ticker: 'FE', amount: 1000 }], size);
    expect(bayUsage(bay('WCB'), load)).toBeCloseTo(0.5);
    expect(bayUsage(bay('HCB'), load)).toBeCloseTo(0.2);
  });
});
