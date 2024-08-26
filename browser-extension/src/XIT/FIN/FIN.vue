<script setup lang="ts">
import { computed } from 'vue';
import { calculateLocationAssets } from '@src/core/financials';
import KeyFigures from '@src/XIT/FIN/KeyFigures.vue';
import FinHeader from '@src/XIT/FIN/FinHeader.vue';
import { formatAmount } from '@src/XIT/FIN/utils';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { cxStore } from '@src/fio/cx';
import { fixed0, fixed2, percent2 } from '@src/utils/format';
import { balance } from '@src/core/balance/balance';
import { currentAssets } from '@src/core/balance/current-assets';
import { nonCurrentAssets } from '@src/core/balance/non-current-assets';
import { currentLiabilities } from '@src/core/balance/current-liabilities';
import { nonCurrentLiabilities } from '@src/core/balance/non-current-liabilities';

const locations = computed(() => calculateLocationAssets());

const acidTestRatio = computed(() => {
  const ratio = balance.acidTestRatio.value;
  if (ratio > 10) {
    return '10+';
  }
  return fixed2(ratio);
});

const figures = computed(() => {
  return [
    { name: 'Current Assets', value: formatAmount(currentAssets.total.value) },
    { name: '(of which Liquid)', value: formatAmount(currentAssets.liquid.value) },
    { name: 'Non-Current Assets', value: formatAmount(nonCurrentAssets.total.value) },
    { name: 'Total Assets', value: formatAmount(balance.totalAssets.value) },
    { name: 'Current Liabilities', value: formatAmount(currentLiabilities.total.value) },
    { name: 'Non-Current Liabilities', value: formatAmount(nonCurrentLiabilities.total.value) },
    { name: 'Total Liabilities', value: formatAmount(balance.totalLiabilities.value) },
    { name: 'Equity', value: formatAmount(balance.equity.value) },
    { name: 'Debt-to-Equity Ratio', value: percent2(balance.debtToEquityRatio.value) },
    { name: 'Acid-Test Ratio', value: acidTestRatio.value },
  ];
});
</script>

<template>
  <LoadingSpinner v-if="!cxStore.fetched" />
  <div v-else>
    <FinHeader>Key Figures</FinHeader>
    <KeyFigures :figures="figures" />
    <FinHeader>Inventory Breakdown</FinHeader>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Non-Current Assets</th>
          <th>Current Assets</th>
          <th>Total Assets</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="location in locations" :key="location.name">
          <td>{{ location.name }}</td>
          <td>{{ fixed0(location.nonCurrent) }}</td>
          <td>{{ fixed0(location.current) }}</td>
          <td>{{ fixed0(location.total) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table tr > *:not(:first-child) {
  text-align: right;
}
</style>
