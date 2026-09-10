import { describe, expect, it } from 'vitest';
import { calcDailyGrowthRate } from '@src/features/XIT/FINCH/growth-rate';

const day = 86400000;
const start = Date.UTC(2026, 0, 1);

function at(...days: number[]) {
  return days.map(x => start + x * day);
}

describe('calcDailyGrowthRate', () => {
  it('reports zero growth for a flat series', () => {
    const result = calcDailyGrowthRate({ timestamps: at(0, 1, 2), values: [1000, 1000, 1000] });
    expect(result.values).toEqual([0, 0]);
  });

  it('anchors each rate to the later of the two points', () => {
    const result = calcDailyGrowthRate({ timestamps: at(0, 1, 2), values: [1000, 1100, 1210] });
    expect(result.timestamps).toEqual(at(1, 2));
    expect(result.values[0]).toBeCloseTo(0.1, 10);
    expect(result.values[1]).toBeCloseTo(0.1, 10);
  });

  it('reports negative growth when the value shrinks', () => {
    const result = calcDailyGrowthRate({ timestamps: at(0, 1), values: [1000, 900] });
    expect(result.values[0]).toBeCloseTo(-0.1, 10);
  });

  // The balance history skips days the player was not logged in, so an unnormalized
  // rate would render four days of compounding as one 46% day.
  it('spreads a multi-day gap across the days it covers', () => {
    const result = calcDailyGrowthRate({ timestamps: at(0, 4), values: [1000, 1464.1] });
    expect(result.values[0]).toBeCloseTo(0.1, 10);
  });

  it('drops points where either end is non-positive', () => {
    const result = calcDailyGrowthRate({
      timestamps: at(0, 1, 2, 3),
      values: [1000, 0, -500, 1000],
    });
    expect(result).toEqual({ timestamps: [], values: [] });
  });

  it('drops points that did not advance in time', () => {
    const result = calcDailyGrowthRate({ timestamps: at(0, 0), values: [1000, 1100] });
    expect(result).toEqual({ timestamps: [], values: [] });
  });

  it('returns nothing for a series too short to have a predecessor', () => {
    expect(calcDailyGrowthRate({ timestamps: at(0), values: [1000] })).toEqual({
      timestamps: [],
      values: [],
    });
    expect(calcDailyGrowthRate({ timestamps: [], values: [] })).toEqual({
      timestamps: [],
      values: [],
    });
  });
});
