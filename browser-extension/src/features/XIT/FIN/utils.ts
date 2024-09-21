import { fixed0, percent0, percent1, percent2 } from '@src/utils/format';
import { userData } from '@src/store/user-data';

export function formatAmount(amount: number | undefined) {
  if (amount === undefined) {
    return '--';
  }
  const sign = amount < 0 ? '-' : '';
  return sign + userData.settings.currency + fixed0(Math.abs(amount));
}

export function formatChange(change: number | undefined) {
  if (change === undefined || !isFinite(change)) {
    return '--';
  }
  const absChange = Math.abs(change);
  let formatted: string;
  if (absChange > 10) {
    return change > 0 ? '> +1,000%' : '< -1,000%';
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
