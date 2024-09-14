<script setup lang="ts">
import { formatAmount } from '@src/features/XIT/FIN/utils';
import { computed } from 'vue';
import { currentAssets } from '@src/core/balance/current-assets';
import { nonCurrentAssets } from '@src/core/balance/non-current-assets';
import { currentLiabilities } from '@src/core/balance/current-liabilities';
import { nonCurrentLiabilities } from '@src/core/balance/non-current-liabilities';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { cxStore } from '@src/infrastructure/fio/cx';
import BalanceSheetSection from '@src/features/XIT/FIN/BalanceSheetSection.vue';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { balance } from '@src/core/balance/balance';
import { lockedAssets } from '@src/core/balance/locked-assets';

interface Section {
  name: string;
  total: number;
  rows: [string, number][];
}

const currentAssetsSection = computed<Section>(() => ({
  name: 'Current Assets',
  total: currentAssets.total.value,
  rows: [
    ['Cash', currentAssets.cashTotal.value],
    ['Deposits', currentAssets.depositsTotal.value],
    ['Interest Receivable', currentAssets.interestReceivable.value],
    ['Accounts Receivable', currentAssets.accountsReceivable.value],
    ['Short-Term Loans', currentAssets.shortTermLoans.value],
    ['Market-Listed Materials', currentAssets.marketListedMaterials.value],
    ['Inventory', currentAssets.inventory.value],
    ['Orders in Progress', currentAssets.totalOrderValue.value],
    ['Materials to Receive', currentAssets.materialsToReceive.value],
  ],
}));

const nonCurrentAssetsSection = computed<Section>(() => ({
  name: 'Non-Current Assets',
  total: nonCurrentAssets.total.value,
  rows: [
    ['Buildings', nonCurrentAssets.buildingsTotal.value],
    ['Accounts Receivable', nonCurrentAssets.accountsReceivable.value],
    ['Long-Term Loans', nonCurrentAssets.longTermLoans.value],
    ['Materials to Receive', nonCurrentAssets.materialsToReceive.value],
  ],
}));

const currentLiabilitiesSection = computed<Section>(() => ({
  name: 'Current Liabilities',
  total: currentLiabilities.total.value,
  rows: [
    ['Accounts Payable', currentLiabilities.accountsPayable.value],
    ['Materials to Deliver', currentLiabilities.materialsToDeliver.value],
    ['Short-Term Debt', currentLiabilities.shortTermDebt.value],
    ['Interest Payable', currentLiabilities.interestPayable.value],
  ],
}));

const nonCurrentLiabilitiesSection = computed<Section>(() => ({
  name: 'Non-Current Liabilities',
  total: nonCurrentLiabilities.total.value,
  rows: [
    ['Accounts Payable', nonCurrentLiabilities.accountsPayable.value],
    ['Materials to Deliver', nonCurrentLiabilities.materialsToDeliver.value],
    ['Long-Term Debt', nonCurrentLiabilities.longTermDebt.value],
  ],
}));

const lockedAssetsSection = computed<Section>(() => ({
  name: 'Locked Assets',
  total: lockedAssets.total.value,
  rows: [
    ['Ships', lockedAssets.ships.value],
    ['HQ Upgrades', lockedAssets.hqUpgrades.value],
    ['APEX Representation Center', lockedAssets.apexRepresentationCenter.value],
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
        <td>{{ formatAmount(balance.totalAssets.value) }}</td>
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
        <td>{{ formatAmount(balance.totalLiabilities.value) }}</td>
        <td>--</td>
        <td>--</td>
        <td>--</td>
      </tr>
    </tbody>
    <tbody>
      <tr :class="[PrunCss.IncomeStatementPanel.totals, $style.total]">
        <td :class="PrunCss.IncomeStatementPanel.number">Equity</td>
        <td>{{ formatAmount(balance.equity.value) }}</td>
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
        <td>{{ formatAmount(balance.companyValue.value) }}</td>
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
.category {
  text-align: center;
}

.total {
  font-weight: bold;
}
</style>
