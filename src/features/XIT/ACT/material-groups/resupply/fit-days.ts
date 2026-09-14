// A 0.01-day step needs about 17 local bill evaluations over 999 days.
export const FIT_DAY_STEP = 0.01;
export const FIT_DAY_MAX = 999;

function daysFromUnits(units: number) {
  return Number((units * FIT_DAY_STEP).toFixed(2));
}

// Largest duration at FIT_DAY_STEP whose bill still fits. `fits` must be
// monotonic: if N fits, every smaller duration fits too.
export function maxFittingDays(fits: (days: number) => boolean): number {
  const maxUnits = Math.round(FIT_DAY_MAX / FIT_DAY_STEP);
  let lo = 0;
  let hi = maxUnits;
  while (lo < hi) {
    const mid = lo + Math.ceil((hi - lo) / 2);
    if (fits(daysFromUnits(mid))) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  return daysFromUnits(lo);
}
