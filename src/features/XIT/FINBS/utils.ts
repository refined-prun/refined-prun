import { fixed0, percent0, percent1, percent2 } from '@src/utils/format';

export function formatAmount(amount: number | undefined) {
  if (amount === undefined) {
    return '--';
  }
  return fixed0(amount);
}

export function formatChange(change: number | undefined) {
  if (change === undefined || !isFinite(change)) {
    return '--';
  }
  const absChange = Math.abs(change);
  let formatted: string;
  if (absChange >= 10) {
    return change > 0 ? '> +999%' : '< -999%';
  }
  if (absChange < 0.0001) {
    return change >= 0 ? '+0%' : '-0%';
  }
  if (absChange > 1) {
    formatted = percent0(absChange);
  } else if (absChange > 0.1) {
    formatted = percent1(absChange);
  } else {
    formatted = percent2(absChange);
  }
  const sign = change > 0 ? '+' : change < 0 ? '-' : '';
  return sign + formatted;
}
