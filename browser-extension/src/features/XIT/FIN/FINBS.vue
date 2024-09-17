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
import { formatAmount } from '@src/features/XIT/FIN/utils';
import { computed } from 'vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { cxStore } from '@src/infrastructure/fio/cx';
import BalanceSheetSection from '@src/features/XIT/FIN/BalanceSheetSection.vue';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { liveBalanceSheet, liveBalanceSummary } from '@src/core/balance/balance-sheet-live';

interface Section {
  name: string;
  total: number;
  rows: [string, number][];
}

const currentAssetsSection = computed<Section>(() => ({
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
    ['Orders in Progress', liveBalanceSheet.currentAssets.ordersInProgress],
    ['Materials to Receive', liveBalanceSheet.currentAssets.materialsToReceive],
  ],
}));

const nonCurrentAssetsSection = computed<Section>(() => ({
  name: 'Non-Current Assets',
  total: liveBalanceSummary.nonCurrentAssets,
  rows: [
    ['Buildings', liveBalanceSheet.nonCurrentAssets.buildings],
    ['Accounts Receivable', liveBalanceSheet.nonCurrentAssets.accountsReceivable],
    ['Long-Term Loans', liveBalanceSheet.nonCurrentAssets.longTermLoans],
    ['Materials to Receive', liveBalanceSheet.nonCurrentAssets.materialsToReceive],
  ],
}));

const currentLiabilitiesSection = computed<Section>(() => ({
  name: 'Current Liabilities',
  total: liveBalanceSummary.currentLiabilities,
  rows: [
    ['Accounts Payable', liveBalanceSheet.currentLiabilities.accountsPayable],
    ['Materials to Deliver', liveBalanceSheet.currentLiabilities.materialsToDeliver],
    ['Short-Term Debt', liveBalanceSheet.currentLiabilities.shortTermDebt],
    ['Interest Payable', liveBalanceSheet.currentLiabilities.interestPayable],
  ],
}));

const nonCurrentLiabilitiesSection = computed<Section>(() => ({
  name: 'Non-Current Liabilities',
  total: liveBalanceSummary.nonCurrentLiabilities,
  rows: [
    ['Accounts Payable', liveBalanceSheet.nonCurrentLiabilities.accountsPayable],
    ['Materials to Deliver', liveBalanceSheet.nonCurrentLiabilities.materialsToDeliver],
    ['Long-Term Debt', liveBalanceSheet.nonCurrentLiabilities.longTermDebt],
  ],
}));

const lockedAssetsSection = computed<Section>(() => ({
  name: 'Locked Assets',
  total: liveBalanceSummary.lockedAssets,
  rows: [
    ['Ships', liveBalanceSheet.lockedAssets.ships],
    ['HQ Upgrades', liveBalanceSheet.lockedAssets.hqUpgrades],
    ['APEX Representation Center', liveBalanceSheet.lockedAssets.arc],
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
    <tbody>
      <tr>
        <th colspan="5">ASSETS</th>
      </tr>
    </tbody>
    <BalanceSheetSection
      :name="currentAssetsSection.name"
      :total="currentAssetsSection.total"
      :rows="currentAssetsSection.rows" />
    <BalanceSheetSection
      :name="nonCurrentAssetsSection.name"
      :total="nonCurrentAssetsSection.total"
      :rows="nonCurrentAssetsSection.rows" />
    <tbody>
      <tr :class="[PrunCss.IncomeStatementPanel.totals, $style.total]">
        <td :class="PrunCss.IncomeStatementPanel.number">Total Assets</td>
        <td>{{ formatAmount(liveBalanceSummary.assets) }}</td>
        <td>--</td>
        <td>--</td>
        <td>--</td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <th colspan="5">LIABILITIES AND EQUITY</th>
      </tr>
    </tbody>
    <BalanceSheetSection
      :name="currentLiabilitiesSection.name"
      :total="currentLiabilitiesSection.total"
      :rows="currentLiabilitiesSection.rows" />
    <BalanceSheetSection
      :name="nonCurrentLiabilitiesSection.name"
      :total="nonCurrentLiabilitiesSection.total"
      :rows="nonCurrentLiabilitiesSection.rows" />
    <tbody>
      <tr :class="[PrunCss.IncomeStatementPanel.totals, $style.total]">
        <td :class="PrunCss.IncomeStatementPanel.number">Total Liabilities</td>
        <td>{{ formatAmount(liveBalanceSummary.liabilities) }}</td>
        <td>--</td>
        <td>--</td>
        <td>--</td>
      </tr>
    </tbody>
    <tbody>
      <tr :class="[PrunCss.IncomeStatementPanel.totals, $style.total]">
        <td :class="PrunCss.IncomeStatementPanel.number">Equity</td>
        <td>{{ formatAmount(liveBalanceSummary.equity) }}</td>
        <td>--</td>
        <td>--</td>
        <td>--</td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <th colspan="5">COMPANY VALUE</th>
      </tr>
    </tbody>
    <BalanceSheetSection
      :name="lockedAssetsSection.name"
      :total="lockedAssetsSection.total"
      :rows="lockedAssetsSection.rows" />
    <tbody>
      <tr :class="[PrunCss.IncomeStatementPanel.totals, $style.total]">
        <td :class="PrunCss.IncomeStatementPanel.number">Company Value</td>
        <td>{{ formatAmount(liveBalanceSummary.companyValue) }}</td>
        <td>--</td>
        <td>--</td>
        <td>--</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table tr > *:not(:first-child) {
  text-align: right;
}
</style>

<style module>
.total {
  font-weight: bold;
}
</style>
