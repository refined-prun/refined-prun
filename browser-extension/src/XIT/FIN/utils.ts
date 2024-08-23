import { CurrencySymbols } from '@src/GameProperties';

export function formatAmount(amount: number) {
  return CurrencySymbols.AIC + Math.round(amount).toLocaleString();
}

export function formatNumber(value: number) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
}
