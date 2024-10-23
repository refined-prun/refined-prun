<script lang="ts">
import xit from '@src/features/XIT/xit-registry.js';
import FINBS from '@src/features/XIT/FINBS/FINBS.vue';

xit.add({
  command: ['FINBS'],
  name: 'Balance Statement',
  contextItems: () => [{ cmd: 'XIT FIN' }, { cmd: 'XIT FINPR' }, { cmd: 'XIT SET FIN' }],
  component: () => FINBS,
});
</script>

<script setup lang="ts">
import { computed } from 'vue';
import BalanceSheetSection from '@src/features/XIT/FINBS/BalanceSheetSection.vue';
import * as summary from '@src/core/balance/balance-sheet-summary';
import { SectionData } from '@src/features/XIT/FINBS/balance-section';
import { liveBalanceSheet } from '@src/core/balance/balance-sheet-live';
import { ddmmyyyy } from '@src/utils/format';
import { lastBalance, previousBalance } from '@src/store/user-data-balance';

const currentAssets = computed<SectionData>(() => ({
  name: 'Current Assets',
  total: summary.calcTotalCurrentAssets,
  children: [
    {
      name: 'Cash and Cash Equivalents',
      value: summary.calcTotalCashAndCashEquivalents,
      children: [
        {
          name: 'Cash',
          value: x => x.assets?.current?.cashAndCashEquivalents?.cash,
        },
        {
          name: 'Deposits',
          value: summary.calcTotalDeposits,
          children: [
            {
              name: 'CX',
              value: x => x.assets?.current?.cashAndCashEquivalents?.deposits?.cx,
            },
            {
              name: 'FX',
              value: x => x.assets?.current?.cashAndCashEquivalents?.deposits?.fx,
            },
          ],
        },
      ],
    },
    {
      name: 'Accounts Receivable',
      value: x => x.assets?.current?.accountsReceivable,
    },
    {
      name: 'Loans Receivable',
      value: summary.calcTotalLoansReceivable,
      children: [
        {
          name: 'Principal',
          value: x => x.assets?.current?.loansReceivable?.principal,
        },
        {
          name: 'Interest',
          value: x => x.assets?.current?.loansReceivable?.interest,
        },
      ],
    },
    {
      name: 'Inventory',
      value: summary.calcTotalInventory,
      children: [
        {
          name: 'CX-Listed Materials',
          value: x => x.assets?.current?.inventory?.cxListedMaterials,
        },
        {
          name: 'CX Inventory',
          value: x => x.assets?.current?.inventory?.cxInventory,
        },
        {
          name: 'Materials in Transit',
          value: x => x.assets?.current?.inventory?.materialsInTransit,
        },
        {
          name: 'Base Inventory',
          value: summary.calcTotalBaseInventory,
          children: [
            {
              name: 'Finished Goods',
              value: x => x.assets?.current?.inventory?.baseInventory?.finishedGoods,
            },
            {
              name: 'Work-in-Progress (WIP)',
              value: x => x.assets?.current?.inventory?.baseInventory?.workInProgress,
            },
            {
              name: 'Raw Materials',
              value: x => x.assets?.current?.inventory?.baseInventory?.rawMaterials,
            },
            {
              name: 'Workforce Consumables',
              value: x => x.assets?.current?.inventory?.baseInventory?.workforceConsumables,
            },
            {
              name: 'Other Items',
              value: x => x.assets?.current?.inventory?.baseInventory?.otherItems,
            },
          ],
        },
        {
          name: 'Fuel Tanks',
          value: x => x.assets?.current?.inventory?.fuelTanks,
        },
        {
          name: 'Materials Receivable',
          value: x => x.assets?.current?.inventory?.materialsReceivable,
        },
      ],
    },
  ],
}));

const nonCurrentAssets = computed<SectionData>(() => ({
  name: 'Non-Current Assets',
  total: summary.calcTotalNonCurrentAssets,
  children: [
    {
      name: 'Buildings, net',
      value: summary.calcTotalBuildings,
      children: [
        {
          name: 'Market Value',
          value: summary.calcTotalBuildingsMarketValue,
          children: [
            {
              name: 'Infrastructure',
              value: x => x.assets?.nonCurrent?.buildings?.marketValue?.infrastructure,
            },
            {
              name: 'Resource Extraction',
              value: x => x.assets?.nonCurrent?.buildings?.marketValue?.resourceExtraction,
            },
            {
              name: 'Production',
              value: x => x.assets?.nonCurrent?.buildings?.marketValue?.production,
            },
          ],
        },
        {
          name: 'Acc. Depreciation',
          less: true,
          value: x => x.assets?.nonCurrent?.buildings?.accumulatedDepreciation,
        },
      ],
    },
    {
      name: 'Ships, net',
      value: summary.calcTotalShips,
      children: [
        {
          name: 'Market Value',
          value: x => x.assets?.nonCurrent?.ships?.marketValue,
        },
        {
          name: 'Acc. Depreciation',
          less: true,
          value: x => x.assets?.nonCurrent?.ships?.accumulatedDepreciation,
        },
      ],
    },
    {
      name: 'Long-Term Receivables',
      value: summary.calcTotalLongTermReceivables,
      children: [
        {
          name: 'Accounts Receivable',
          value: x => x.assets?.nonCurrent?.longTermReceivables?.accountsReceivable,
        },
        {
          name: 'Materials in Transit',
          value: x => x.assets?.nonCurrent?.longTermReceivables?.materialsInTransit,
        },
        {
          name: 'Materials Receivable',
          value: x => x.assets?.nonCurrent?.longTermReceivables?.materialsReceivable,
        },
        {
          name: 'Loans Principal',
          value: x => x.assets?.nonCurrent?.longTermReceivables?.loansPrincipal,
        },
      ],
    },
    {
      name: 'Intangible Assets',
      value: summary.calcTotalIntangibleAssets,
      children: [
        {
          name: 'HQ Upgrades',
          value: x => x.assets?.nonCurrent?.intangibleAssets?.hqUpgrades,
        },
        {
          name: 'APEX Representation Center',
          value: x => x.assets?.nonCurrent?.intangibleAssets?.arc,
        },
      ],
    },
  ],
}));

const currentLiabilities = computed<SectionData>(() => ({
  name: 'Current Liabilities',
  total: summary.calcTotalCurrentLiabilities,
  children: [
    {
      name: 'Accounts Payable',
      value: x => x.liabilities?.current?.accountsPayable,
    },
    {
      name: 'Materials Payable',
      value: x => x.liabilities?.current?.materialsPayable,
    },
    {
      name: 'Loans Payable',
      value: summary.calcTotalLoansPayable,
      children: [
        {
          name: 'Principal',
          value: x => x.liabilities?.current?.loansPayable?.principal,
        },
        {
          name: 'Interest',
          value: x => x.liabilities?.current?.loansPayable?.interest,
        },
      ],
    },
  ],
}));

const nonCurrentLiabilities = computed<SectionData>(() => ({
  name: 'Non-Current Liabilities',
  total: summary.calcTotalNonCurrentLiabilities,
  children: [
    {
      name: 'Long-Term Payables',
      value: summary.calcTotalLongTermPayables,
      children: [
        {
          name: 'Accounts Payable',
          value: x => x.liabilities?.nonCurrent?.longTermPayables?.accountsPayable,
        },
        {
          name: 'Materials Payable',
          value: x => x.liabilities?.nonCurrent?.longTermPayables?.materialsPayable,
        },
        {
          name: 'Loans Principal',
          value: x => x.liabilities?.nonCurrent?.longTermPayables?.loansPrincipal,
        },
      ],
    },
  ],
}));

const equity = computed<SectionData>(() => ({
  name: 'Equity',
  coloredTotal: true,
  total: summary.calcEquity,
  children: [
    {
      name: 'Total Assets',
      value: summary.calcTotalAssets,
    },
    {
      name: 'Total Liabilities',
      less: true,
      value: summary.calcTotalLiabilities,
    },
  ],
}));

const sections = [
  currentAssets,
  nonCurrentAssets,
  currentLiabilities,
  nonCurrentLiabilities,
  equity,
];
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th>Current Period</th>
        <th>
          <template v-if="lastBalance">{{ ddmmyyyy(lastBalance.timestamp) }}</template>
          <template v-else>Last Period</template>
        </th>
        <th>
          <template v-if="previousBalance">{{ ddmmyyyy(previousBalance.timestamp) }}</template>
          <template v-else>Previous Period</template>
        </th>
        <th>Change</th>
      </tr>
    </thead>
    <BalanceSheetSection
      v-for="section in sections"
      :key="section.value.name"
      :current="liveBalanceSheet"
      :last="lastBalance"
      :previous="previousBalance"
      :section="section.value" />
  </table>
</template>

<style scoped>
table tr > *:not(:first-child) {
  text-align: right;
}
</style>
