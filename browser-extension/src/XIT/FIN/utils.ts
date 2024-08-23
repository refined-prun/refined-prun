import { settings } from '@src/store/settings';

export function formatAmount(amount: number) {
  return settings.fin.currency + Math.round(amount).toLocaleString();
}

export function formatNumber(value: number) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
}
