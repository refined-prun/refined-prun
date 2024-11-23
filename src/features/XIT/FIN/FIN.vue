<script setup lang="ts">
import { calculateLocationAssets } from '@src/core/financials';
import KeyFigures from '@src/features/XIT/FIN/KeyFigures.vue';
import FinHeader from '@src/features/XIT/FIN/FinHeader.vue';
import {
  fixed0,
  fixed1,
  fixed2,
  formatCurrency,
  percent0,
  percent1,
  percent2,
} from '@src/utils/format';
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
    {
      name: 'Quick Assets',
      value: formatCurrency(liveBalanceSummary.quickAssets),
      tooltip:
        'Quick Assets are: Cash and Cash Equivalents, Current Accounts Receivable, and' +
        ' Current Loans Receivable. These assets are either liquid or close-to-liquid and' +
        ' are used in Quick Ratio calculation.',
    },
    {
      name: 'Current Assets',
      value: formatCurrency(liveBalanceSummary.currentAssets),
    },
    { name: 'Total Assets', value: formatCurrency(liveBalanceSummary.assets) },
    { name: 'Equity', value: formatCurrency(liveBalanceSummary.equity) },
    {
      name: 'Quick Liabilities',
      value: formatCurrency(liveBalanceSummary.quickLiabilities),
      tooltip:
        'Quick Liabilities are: Current Accounts Payable and Current Loans Payable. These' +
        ' liabilities represent immediate financial obligations and are used in Quick Ratio' +
        ' calculation.',
    },
    {
      name: 'Current Liabilities',
      value: formatCurrency(liveBalanceSummary.currentLiabilities),
    },
    {
      name: 'Total Liabilities',
      value: formatCurrency(liveBalanceSummary.liabilities),
    },
    {
      name: 'Liquidation Value',
      value: formatCurrency(liveBalanceSummary.liquidationValue),
      tooltip:
        'The market value of all company’s assets that can be converted to cash directly. ' +
        'The Liquidation Value excludes such assets as ships, HQ upgrades, and ARC, since ' +
        'they cannot be sold on the market.',
    },
    {
      name: 'Quick Ratio',
      value: formatRatio(liveBalanceSummary.acidTestRatio),
      tooltip:
        "The quick, or acid-test ratio, compares a company's quick assets to its quick" +
        ' liabilities to see if it has enough cash to pay its immediate liabilities,' +
        ' such as short-term debt. Generally, a ratio of 1.0 or more indicates a company can pay' +
        ' its short-term obligations, while a ratio of less than 1.0 indicates it might struggle' +
        ' to pay them.',
    },
    {
      name: 'Debt Ratio',
      value: formatPercentage(liveBalanceSummary.debtRatio),
      tooltip:
        'The debt ratio is defined as the ratio of total debt to total assets. A debt ratio' +
        ' of greater than 100% means a company has more debt than assets while a debt ratio' +
        ' of less than 100% indicates that a company has more assets than debt.',
    },
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
