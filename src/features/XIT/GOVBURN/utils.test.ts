import { describe, expect, it } from 'vitest';
import {
  buildingDays,
  planetDays,
  planetGovBurnBill,
  resolveSlots,
  upkeepBuyAmount,
} from './utils';

const day = 24 * 60 * 60 * 1000;

const upkeep: UserData.GovBurnUpkeep = {
  ticker: 'OFF',
  amount: 100,
  duration: 5,
  stored: 600,
  nextTick: day,
};

it('combines shared materials across buildings and CoGC without buying covered reserves', () => {
  const planet: UserData.GovBurnPlanet = {
    naturalId: 'P',
    name: 'Planet',
    capturedAt: 0,
    buildings: ['INF', 'HOS'].map(ticker => ({
      ticker,
      type: ticker,
      projectId: ticker,
      level: 1,
      upkeeps: [
        { ...upkeep, stored: 0 },
        { ...upkeep, ticker: 'TUB' },
      ],
    })),
    cogc: {
      dueDate: day,
      materials: [
        { ticker: 'OFF', amount: 30, currentAmount: 30 },
        { ticker: 'RAT', amount: 20, currentAmount: 0 },
      ],
    },
  };
  const slots = {
    INF: resolveSlots(planet.buildings[0], 2, ['OFF', 'TUB']),
    HOS: resolveSlots(planet.buildings[1], 2, ['OFF', 'TUB']),
  };

  expect(planetGovBurnBill(planet, slots, 5, 0)).toEqual({
    OFF: 230,
    RAT: 20,
  });
});

describe('upkeepBuyAmount', () => {
  it('subtracts consumption since capture before sizing a resupply', () => {
    expect(upkeepBuyAmount(upkeep, 5, 26 * day + 1)).toBe(100);
  });

  it('keeps the original tick schedule when the snapshot is old', () => {
    expect(upkeepBuyAmount({ ...upkeep, stored: 0 }, 5, 7 * day)).toBe(100);
  });

  it('does not charge for unpaid ticks in the past', () => {
    expect(upkeepBuyAmount({ ...upkeep, stored: 100 }, 10, 27 * day)).toBe(200);
  });

  it('credits the reserve left after elapsed ticks', () => {
    expect(upkeepBuyAmount({ ...upkeep, stored: 350 }, 10, 12 * day)).toBe(150);
  });

  it('includes a tick on the horizon boundary', () => {
    expect(upkeepBuyAmount({ ...upkeep, stored: 0 }, 5, day)).toBe(200);
  });

  it('covers the next tick even when it is outside the horizon', () => {
    expect(upkeepBuyAmount({ ...upkeep, stored: 0, nextTick: 15 * day }, 5, 0)).toBe(100);
  });

  it('keeps fresh, sufficient reserves unchanged', () => {
    expect(upkeepBuyAmount(upkeep, 30, 0)).toBe(0);
  });
});

describe('saved upkeep slots', () => {
  const building: UserData.GovBurnBuilding = {
    ticker: 'INF',
    type: 'INFIRMARY',
    projectId: 'project',
    level: 1,
    upkeeps: [
      { ...upkeep, stored: 500 },
      { ticker: 'TUB', amount: 100, duration: 15, stored: 0, nextTick: 2 * day },
    ],
  };

  it('uses the saved choice for both building and planet days', () => {
    expect(buildingDays(building, 1, 0, ['TUB'])).toBe(2);
    expect(
      planetDays(
        { naturalId: 'P', name: 'Planet', capturedAt: 0, buildings: [building] },
        { INF: 1 },
        0,
        { INF: ['TUB'] },
      ).days,
    ).toBe(2);
  });

  it('keeps automatic selection when no choices are saved', () => {
    expect(buildingDays(building, 1, 0)).toBe(26);
  });

  it('preserves an explicitly cleared slot and the indices of other choices', () => {
    expect(resolveSlots(building, 2, ['', 'TUB']).map(x => x.ticker)).toEqual(['', 'TUB']);
  });
});
