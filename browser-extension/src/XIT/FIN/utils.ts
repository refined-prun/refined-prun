import { CurrencySymbols } from '@src/GameProperties';

export function formatAmount(amount: number) {
  return CurrencySymbols.AIC + Math.round(amount).toLocaleString();
}
