import { describe, expect, it } from 'vitest';
import { FIT_DAY_MAX, FIT_DAY_STEP, maxFittingDays } from './fit-days';

describe('maxFittingDays', () => {
  it('keeps a fit that is only available between whole days', () => {
    expect(maxFittingDays(days => days <= 12.34)).toBe(12.34);
  });

  it('finds a single step above zero', () => {
    expect(maxFittingDays(days => days <= FIT_DAY_STEP)).toBe(FIT_DAY_STEP);
  });

  it('returns 0 when only zero fits', () => {
    expect(maxFittingDays(days => days <= 0)).toBe(0);
  });

  it('returns the whole-day cap when every duration fits', () => {
    expect(maxFittingDays(() => true)).toBe(FIT_DAY_MAX);
  });

  it('still lands on a whole day when that is the true maximum', () => {
    expect(maxFittingDays(days => days <= 5)).toBe(5);
  });

  it('evaluates the predicate a logarithmic number of times', () => {
    let n = 0;
    maxFittingDays(days => {
      n += 1;
      return days <= 50;
    });
    expect(n).toBeLessThanOrEqual(20);
  });
});
