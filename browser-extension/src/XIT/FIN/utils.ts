import { settings } from '@src/store/settings';
import { fixed0 } from '@src/utils/format';

export function formatAmount(amount: number) {
  return settings.fin.currency + fixed0(amount);
}
