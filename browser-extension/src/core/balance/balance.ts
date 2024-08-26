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

const debtRatio = computed(() => totalLiabilities.value / totalAssets.value);

const workingCapitalRatio = computed(() => totalAssets.value / totalLiabilities.value);

const debtToEquityRatio = computed(() => totalLiabilities.value / equity.value);

const acidTestRatio = computed(() => {
  const quickAssets =
    currentAssets.liquid.value +
    currentAssets.accountsReceivable.value +
    currentAssets.shortTermLoans.value;
  const liabilities = currentLiabilities.total.value;
  return quickAssets / liabilities;
});

export const balance = {
  totalAssets,
  totalLiabilities,
  equity,
  workingCapitalRatio,
  debtRatio,
  debtToEquityRatio,
  acidTestRatio,
};
