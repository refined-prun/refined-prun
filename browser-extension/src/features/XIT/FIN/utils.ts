import { fixed0 } from '@src/utils/format';
import { userData } from '@src/store/user-data';

export function formatAmount(amount: number) {
  return userData.settings.currency + fixed0(amount);
}
