<script lang="ts">
import xit from '@src/features/XIT/xit-registry.js';
import FINBS from '@src/features/XIT/FIN/FINBS.vue';

xit.add({
  command: ['FINBS'],
  name: 'Balance Statement',
  contextItems: () => [{ cmd: 'XIT FIN' }, { cmd: 'XIT FINPR' }, { cmd: 'XIT SET FIN' }],
  component: () => FINBS,
});
</script>

<script setup lang="ts">
import { computed } from 'vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { cxStore } from '@src/infrastructure/fio/cx';
import BalanceSheetSection from '@src/features/XIT/FIN/BalanceSheetSection.vue';
import { liveBalanceSheet, liveBalanceSummary } from '@src/core/balance/balance-sheet-live';

interface Section {
  name: string;
  total: number;
  rows: [string, number][];
}

const currentAssets = computed<Section>(() => ({
  name: 'Current Assets',
  total: liveBalanceSummary.currentAssets,
  rows: [
    ['Cash', liveBalanceSheet.currentAssets.cash],
    ['Deposits', liveBalanceSheet.currentAssets.deposits],
    ['Interest Receivable', liveBalanceSheet.currentAssets.interestReceivable],
    ['Accounts Receivable', liveBalanceSheet.currentAssets.accountsReceivable],
    ['Short-Term Loans', liveBalanceSheet.currentAssets.shortTermLoans],
    ['Market-Listed Materials', liveBalanceSheet.currentAssets.marketListedMaterials],
    ['Inventory', liveBalanceSheet.currentAssets.inventory],
    ['Work-in-Progress (WIP)', liveBalanceSheet.currentAssets.ordersInProgress],
    ['Materials to Receive', liveBalanceSheet.currentAssets.materialsToReceive],
  ],
}));

const nonCurrentAssets = computed<Section>(() => ({
  name: 'Non-Current Assets',
  total: liveBalanceSummary.nonCurrentAssets,
  rows: [
    ['Buildings', liveBalanceSheet.nonCurrentAssets.buildings],
    ['Accounts Receivable', liveBalanceSheet.nonCurrentAssets.accountsReceivable],
    ['Long-Term Loans', liveBalanceSheet.nonCurrentAssets.longTermLoans],
    ['Materials to Receive', liveBalanceSheet.nonCurrentAssets.materialsToReceive],
  ],
}));

const currentLiabilities = computed<Section>(() => ({
  name: 'Current Liabilities',
  total: liveBalanceSummary.currentLiabilities,
  rows: [
    ['Accounts Payable', liveBalanceSheet.currentLiabilities.accountsPayable],
    ['Materials to Deliver', liveBalanceSheet.currentLiabilities.materialsToDeliver],
    ['Short-Term Debt', liveBalanceSheet.currentLiabilities.shortTermDebt],
    ['Interest Payable', liveBalanceSheet.currentLiabilities.interestPayable],
  ],
}));

const nonCurrentLiabilities = computed<Section>(() => ({
  name: 'Non-Current Liabilities',
  total: liveBalanceSummary.nonCurrentLiabilities,
  rows: [
    ['Accounts Payable', liveBalanceSheet.nonCurrentLiabilities.accountsPayable],
    ['Materials to Deliver', liveBalanceSheet.nonCurrentLiabilities.materialsToDeliver],
    ['Long-Term Debt', liveBalanceSheet.nonCurrentLiabilities.longTermDebt],
  ],
}));

const equity = computed<Section>(() => ({
  name: 'Equity',
  total: liveBalanceSummary.equity,
  rows: [
    ['Total Assets', liveBalanceSummary.assets],
    ['Total Liabilities', -liveBalanceSummary.liabilities],
  ],
}));

const lockedAssets = computed<Section>(() => ({
  name: 'Locked Assets',
  total: liveBalanceSummary.lockedAssets,
  rows: [
    ['Ships', liveBalanceSheet.lockedAssets.ships],
    ['HQ Upgrades', liveBalanceSheet.lockedAssets.hqUpgrades],
    ['APEX Representation Center', liveBalanceSheet.lockedAssets.arc],
  ],
}));

const companyValue = computed<Section>(() => ({
  name: 'Company Value',
  total: liveBalanceSummary.companyValue,
  rows: [
    ['Equity', liveBalanceSummary.equity],
    ['Locked Assets', liveBalanceSummary.lockedAssets],
  ],
}));
</script>

<template>
  <LoadingSpinner v-if="!cxStore.fetched" />
  <table v-else>
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th>Current Period</th>
        <th>Last Period</th>
        <th>Previous Period</th>
        <th>Change</th>
      </tr>
    </thead>
    <BalanceSheetSection
      :name="currentAssets.name"
      :total="currentAssets.total"
      :rows="currentAssets.rows" />
    <BalanceSheetSection
      :name="nonCurrentAssets.name"
      :total="nonCurrentAssets.total"
      :rows="nonCurrentAssets.rows" />
    <BalanceSheetSection
      :name="currentLiabilities.name"
      :total="currentLiabilities.total"
      :rows="currentLiabilities.rows" />
    <BalanceSheetSection
      :name="nonCurrentLiabilities.name"
      :total="nonCurrentLiabilities.total"
      :rows="nonCurrentLiabilities.rows" />
    <BalanceSheetSection
      :name="equity.name"
      :total="equity.total"
      :rows="equity.rows" />
    <BalanceSheetSection
      :name="lockedAssets.name"
      :total="lockedAssets.total"
      :rows="lockedAssets.rows" />
    <BalanceSheetSection
      :name="companyValue.name"
      :total="companyValue.total"
      :rows="companyValue.rows" />
  </table>
</template>

<style scoped>
table tr > *:not(:first-child) {
  text-align: right;
}
</style>
