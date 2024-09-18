import { fixed0 } from '@src/utils/format';
import { userData } from '@src/store/user-data';

export function formatAmount(amount: number) {
  const sign = amount < 0 ? '-' : '';
  return sign + userData.settings.currency + fixed0(Math.abs(amount));
}
