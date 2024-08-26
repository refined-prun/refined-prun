import { computed } from 'vue';
import { currentAssets } from '@src/core/balance/current-assets';
import { nonCurrentAssets } from '@src/core/balance/non-current-assets';
import { currentLiabilities } from '@src/core/balance/current-liabilities';
import { nonCurrentLiabilities } from '@src/core/balance/non-current-liabilities';

const totalAssets = computed(() => currentAssets.total.value + nonCurrentAssets.total.value);

const totalLiabilities = computed(
  () => currentLiabilities.total.value + nonCurrentLiabilities.total.value,
);

const equity = computed(() => totalAssets.value - totalLiabilities.value);

const debtToEquityRatio = computed(() =>
  equity.value > 0 ? totalLiabilities.value / equity.value : 1,
);

const acidTestRatio = computed(() => {
  const quickAssets =
    currentAssets.liquid.value +
    currentAssets.accountsReceivable.value +
    currentAssets.shortTermLoans.value;
  const liabilities = currentLiabilities.total.value;
  return liabilities > 0 ? quickAssets / liabilities : Number.POSITIVE_INFINITY;
});

export const balance = {
  totalAssets,
  totalLiabilities,
  equity,
  debtToEquityRatio,
  acidTestRatio,
};
