import { diffDays } from '@src/utils/time-diff';

export interface ChartSeries {
  timestamps: number[];
  values: number[];
}

// Converts a series of absolute values into the compounded rate of change per day
// between consecutive points. The rate is normalized by the elapsed time instead of
// being taken point to point, because the balance history only records days the
// player was logged in: without it, a week-long gap would render its entire change
// as a single-day spike.
export function calcDailyGrowthRate(series: ChartSeries): ChartSeries {
  const timestamps: number[] = [];
  const values: number[] = [];

  for (let i = 1; i < series.values.length; i++) {
    const previous = series.values[i - 1];
    const current = series.values[i];
    // A percentage rate of change is undefined once either end is non-positive,
    // so days spent at or below zero equity are dropped rather than plotted.
    if (previous <= 0 || current <= 0) {
      continue;
    }

    const days = diffDays(series.timestamps[i - 1], series.timestamps[i], true);
    if (days <= 0) {
      continue;
    }

    timestamps.push(series.timestamps[i]);
    values.push((current / previous) ** (1 / days) - 1);
  }

  return { timestamps, values };
}
