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

const acidTestRatio = computed(() => currentAssets.quick.value / currentLiabilities.quick.value);

const workingCapitalRatio = computed(() => totalAssets.value / totalLiabilities.value);

const debtRatio = computed(() => totalLiabilities.value / totalAssets.value);

const debtToEquityRatio = computed(() => totalLiabilities.value / equity.value);

const companyValue = computed(() => equity.value + lockedAssets.total.value);

export const balance = {
  totalAssets,
  totalLiabilities,
  equity,
  acidTestRatio,
  workingCapitalRatio,
  debtRatio,
  debtToEquityRatio,
  companyValue,
};
