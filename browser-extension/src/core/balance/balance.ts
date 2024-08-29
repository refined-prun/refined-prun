import { computed } from 'vue';
import { currentAssets } from '@src/core/balance/current-assets';
import { nonCurrentAssets } from '@src/core/balance/non-current-assets';
import { currentLiabilities } from '@src/core/balance/current-liabilities';
import { nonCurrentLiabilities } from '@src/core/balance/non-current-liabilities';
import { lockedAssets } from '@src/core/balance/locked-assets';

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
    currentAssets.quick.value +
    currentAssets.accountsReceivable.value +
    currentAssets.shortTermLoans.value;
  const quickLiabilities =
    currentLiabilities.accountsPayable.value + currentLiabilities.shortTermDebt.value;
  return quickAssets / quickLiabilities;
});

const companyValue = computed(() => equity.value + lockedAssets.total.value);

export const balance = {
  totalAssets,
  totalLiabilities,
  equity,
  workingCapitalRatio,
  debtRatio,
  debtToEquityRatio,
  acidTestRatio,
  companyValue,
};
