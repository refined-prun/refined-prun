<script lang="ts">
import xit from '@src/features/XIT/xit-registry.js';
import FIN from '@src/features/XIT/FIN/FIN.vue';

xit.add({
  command: ['FIN'],
  name: 'Financial overview',
  contextItems: () => [{ cmd: 'XIT FINPR' }, { cmd: 'XIT FINCH' }, { cmd: 'XIT SET FIN' }],
  component: () => FIN,
});
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { calculateLocationAssets } from '@src/core/financials';
import KeyFigures from '@src/features/XIT/FIN/KeyFigures.vue';
import FinHeader from '@src/features/XIT/FIN/FinHeader.vue';
import { formatAmount } from '@src/features/XIT/FIN/utils';
import { fixed0, fixed1, fixed2, percent0, percent1, percent2 } from '@src/utils/format';
import { liveBalanceSummary } from '@src/core/balance/balance-sheet-live';

const locations = computed(() => calculateLocationAssets());

function formatRatio(ratio: number | undefined) {
  if (ratio === undefined) {
    return '--';
  }
  if (!isFinite(ratio)) {
    return 'N/A';
  }
  const absRatio = Math.abs(ratio);
  if (absRatio > 1000) {
    return ratio > 0 ? '> 1,000' : '< -1,000';
  }
  if (absRatio > 100) {
    return fixed0(ratio);
  }
  if (absRatio > 10) {
    return fixed1(ratio);
  }
  return fixed2(ratio);
}

function formatPercentage(ratio: number | undefined) {
  if (ratio === undefined) {
    return '--';
  }
  if (!isFinite(ratio)) {
    return 'N/A';
  }
  const absRatio = Math.abs(ratio);
  if (absRatio > 10) {
    return ratio > 0 ? '> 1,000%' : '< -1,000%';
  }
  if (absRatio > 1) {
    return percent0(ratio);
  }
  if (absRatio > 0.1) {
    return percent1(ratio);
  }
  return percent2(ratio);
}

const figures = computed(() => {
  return [
    { name: 'Quick Assets', value: formatAmount(liveBalanceSummary.quickAssets) },
    { name: 'Current Assets', value: formatAmount(liveBalanceSummary.currentAssets) },
    { name: 'Total Assets', value: formatAmount(liveBalanceSummary.assets) },
    { name: 'Equity', value: formatAmount(liveBalanceSummary.equity) },
    { name: 'Quick Liabilities', value: formatAmount(liveBalanceSummary.quickLiabilities) },
    { name: 'Current Liabilities', value: formatAmount(liveBalanceSummary.currentLiabilities) },
    { name: 'Total Liabilities', value: formatAmount(liveBalanceSummary.liabilities) },
    { name: 'Company Value', value: formatAmount(liveBalanceSummary.companyValue) },
    { name: 'Acid-Test Ratio', value: formatRatio(liveBalanceSummary.acidTestRatio) },
    { name: 'Working Capital Ratio', value: formatRatio(liveBalanceSummary.workingCapitalRatio) },
    { name: 'Debt Ratio', value: formatPercentage(liveBalanceSummary.debtRatio) },
    { name: 'Debt-to-Equity Ratio', value: formatRatio(liveBalanceSummary.debtToEquityRatio) },
  ];
});
</script>

<template>
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
</template>

<style scoped>
table tr > *:not(:first-child) {
  text-align: right;
}
</style>
