<script setup lang="ts">
import BalanceSheetSection from '@src/features/XIT/FINBS/BalanceSheetSection.vue';
import * as summary from '@src/core/balance/balance-sheet-summary';
import { SectionData } from '@src/features/XIT/FINBS/balance-section';
import { liveBalanceSheet } from '@src/core/balance/balance-sheet-live';
import { ddmmyyyy } from '@src/utils/format';
import { lastBalance, previousBalance } from '@src/store/user-data-balance';
import { userData } from '@src/store/user-data';

const currentAssets = computed<SectionData>(() => ({
  name: 'Current Assets',
  chartId: 'CURRENT ASSETS',
  value: summary.calcTotalCurrentAssets,
  children: [
    {
      name: 'Cash and Cash Equivalents',
      chartId: 'CA CASH EQUIVALENTS',
      value: summary.calcTotalCashAndCashEquivalents,
      children: [
        {
          name: 'Cash',
          chartId: 'CA CASH',
          value: x => x.assets?.current?.cashAndCashEquivalents?.cash,
        },
        {
          name: 'Deposits',
          chartId: 'CA DEPOSITS',
          value: summary.calcTotalDeposits,
          children: [
            {
              name: 'CX',
              chartId: 'CA DEPOSITS CX',
              value: x => x.assets?.current?.cashAndCashEquivalents?.deposits?.cx,
            },
            {
              name: 'FX',
              chartId: 'CA DEPOSITS FX',
              value: x => x.assets?.current?.cashAndCashEquivalents?.deposits?.fx,
            },
          ],
        },
        {
          name: 'MM Materials',
          chartId: 'CA MM MATERIALS',
          tooltip:
            'Market Maker materials currently stored in CX warehouses. You can customize the list of' +
            ' these materials using XIT SET FIN. Since these materials can be converted into cash' +
            ' immediately, they are considered Cash Equivalents.',
          value: x => x.assets?.current?.cashAndCashEquivalents?.mmMaterials,
        },
      ],
    },
    {
      name: 'Accounts Receivable',
      chartId: 'CA ACCOUNTS RECEIVABLE',
      value: x => x.assets?.current?.accountsReceivable,
    },
    {
      name: 'Loans Receivable',
      chartId: 'CA LOANS RECEIVABLE',
      value: summary.calcTotalLoansReceivable,
      children: [
        {
          name: 'Principal',
          chartId: 'CA LOANS PRINCIPAL',
          value: x => x.assets?.current?.loansReceivable?.principal,
        },
        {
          name: 'Interest',
          chartId: 'CA LOANS INTEREST',
          value: x => x.assets?.current?.loansReceivable?.interest,
        },
      ],
    },
    {
      name: 'Inventory',
      chartId: 'CA INVENTORY',
      value: summary.calcTotalInventory,
      children: [
        {
          name: 'CX-Listed Materials',
          chartId: 'CA CX LISTED MATERIALS',
          value: x => x.assets?.current?.inventory?.cxListedMaterials,
        },
        {
          name: 'CX Inventory',
          chartId: 'CA CX INVENTORY',
          value: x => x.assets?.current?.inventory?.cxInventory,
        },
        {
          name: 'Materials in Transit',
          chartId: 'CA MATERIALS IN TRANSIT',
          value: x => x.assets?.current?.inventory?.materialsInTransit,
        },
        {
          name: 'Base Inventory',
          chartId: 'CA BASE INVENTORY',
          value: summary.calcTotalBaseInventory,
          children: [
            {
              name: 'Finished Goods',
              chartId: 'CA FINISHED GOODS',
              value: x => x.assets?.current?.inventory?.baseInventory?.finishedGoods,
            },
            {
              name: 'Work-in-Progress (WIP)',
              chartId: 'CA WORK IN PROGRESS',
              value: x => x.assets?.current?.inventory?.baseInventory?.workInProgress,
            },
            {
              name: 'Raw Materials',
              chartId: 'CA RAW MATERIALS',
              value: x => x.assets?.current?.inventory?.baseInventory?.rawMaterials,
            },
            {
              name: 'Workforce Consumables',
              chartId: 'CA WORKFORCE CONSUMABLES',
              value: x => x.assets?.current?.inventory?.baseInventory?.workforceConsumables,
            },
            {
              name: 'Other Items',
              chartId: 'CA OTHER ITEMS',
              value: x => x.assets?.current?.inventory?.baseInventory?.otherItems,
            },
          ],
        },
        {
          name: 'Fuel Tanks',
          chartId: 'CA FUEL TANKS',
          value: x => x.assets?.current?.inventory?.fuelTanks,
        },
        {
          name: 'Materials Receivable',
          chartId: 'CA MATERIALS RECEIVABLE',
          value: x => x.assets?.current?.inventory?.materialsReceivable,
        },
      ],
    },
  ],
}));

const nonCurrentAssets = computed<SectionData>(() => ({
  name: 'Non-Current Assets',
  chartId: 'NON CURRENT ASSETS',
  value: summary.calcTotalNonCurrentAssets,
  children: [
    {
      name: 'Buildings, net',
      chartId: 'NCA BUILDINGS',
      value: summary.calcTotalBuildings,
      children: [
        {
          name: 'Market Value',
          chartId: 'NCA BUILDINGS VALUE',
          value: summary.calcTotalBuildingsMarketValue,
          children: [
            {
              name: 'Infrastructure',
              chartId: 'NCA BUILDINGS INFRASTRUCTURE',
              value: x => x.assets?.nonCurrent?.buildings?.marketValue?.infrastructure,
            },
            {
              name: 'Resource Extraction',
              chartId: 'NCA BUILDINGS RESOURCE EXTRACTION',
              value: x => x.assets?.nonCurrent?.buildings?.marketValue?.resourceExtraction,
            },
            {
              name: 'Production',
              chartId: 'NCA BUILDINGS PRODUCTION',
              value: x => x.assets?.nonCurrent?.buildings?.marketValue?.production,
            },
          ],
        },
        {
          name: 'Acc. Depreciation',
          chartId: 'NCA BUILDINGS DEPRECIATION',
          less: true,
          value: x => x.assets?.nonCurrent?.buildings?.accumulatedDepreciation,
        },
      ],
    },
    {
      name: 'Ships, net',
      chartId: 'NCA SHIPS',
      value: summary.calcTotalShips,
      excluded: !userData.fullEquityMode,
      children: [
        {
          name: 'Market Value',
          chartId: 'NCA SHIPS VALUE',
          value: x => x.assets?.nonCurrent?.ships?.marketValue,
        },
        {
          name: 'Acc. Depreciation',
          chartId: 'NCA SHIPS DEPRECIATION',
          less: true,
          value: x => x.assets?.nonCurrent?.ships?.accumulatedDepreciation,
        },
      ],
    },
    {
      name: 'Long-Term Receivables',
      chartId: 'NCA LONG TERM RECEIVABLES',
      value: summary.calcTotalLongTermReceivables,
      children: [
        {
          name: 'Accounts Receivable',
          chartId: 'NCA ACCOUNTS RECEIVABLE',
          value: x => x.assets?.nonCurrent?.longTermReceivables?.accountsReceivable,
        },
        {
          name: 'Materials in Transit',
          chartId: 'NCA MATERIALS IN TRANSIT',
          value: x => x.assets?.nonCurrent?.longTermReceivables?.materialsInTransit,
        },
        {
          name: 'Materials Receivable',
          chartId: 'NCA MATERIALS RECEIVABLE',
          value: x => x.assets?.nonCurrent?.longTermReceivables?.materialsReceivable,
        },
        {
          name: 'Loans Principal',
          chartId: 'NCA LOANS PRINCIPAL',
          value: x => x.assets?.nonCurrent?.longTermReceivables?.loansPrincipal,
        },
      ],
    },
    {
      name: 'Intangible Assets',
      chartId: 'NCA INTANGIBLE ASSETS',
      value: summary.calcTotalIntangibleAssets,
      excluded: !userData.fullEquityMode,
      children: [
        {
          name: 'HQ Upgrades',
          chartId: 'NCA HQ UPGRADES',
          value: x => x.assets?.nonCurrent?.intangibleAssets?.hqUpgrades,
        },
        {
          name: 'APEX Representation Center',
          chartId: 'NCA ARC',
          value: x => x.assets?.nonCurrent?.intangibleAssets?.arc,
        },
      ],
    },
  ],
}));

const currentLiabilities = computed<SectionData>(() => ({
  name: 'Current Liabilities',
  chartId: 'CURRENT LIABILITIES',
  value: summary.calcTotalCurrentLiabilities,
  children: [
    {
      name: 'Accounts Payable',
      chartId: 'CL ACCOUNTS PAYABLE',
      value: x => x.liabilities?.current?.accountsPayable,
    },
    {
      name: 'Materials Payable',
      chartId: 'CL MATERIALS PAYABLE',
      value: x => x.liabilities?.current?.materialsPayable,
    },
    {
      name: 'Loans Payable',
      chartId: 'CL LOANS PAYABLE',
      value: summary.calcTotalLoansPayable,
      children: [
        {
          name: 'Principal',
          chartId: 'CL LOANS PRINCIPAL',
          value: x => x.liabilities?.current?.loansPayable?.principal,
        },
        {
          name: 'Interest',
          chartId: 'CL LOANS INTEREST',
          value: x => x.liabilities?.current?.loansPayable?.interest,
        },
      ],
    },
  ],
}));

const nonCurrentLiabilities = computed<SectionData>(() => ({
  name: 'Non-Current Liabilities',
  chartId: 'NON CURRENT LIABILITIES',
  value: summary.calcTotalNonCurrentLiabilities,
  children: [
    {
      name: 'Long-Term Payables',
      chartId: 'NCL LONG TERM PAYABLES',
      value: summary.calcTotalLongTermPayables,
      children: [
        {
          name: 'Accounts Payable',
          chartId: 'NCL ACCOUNTS PAYABLE',
          value: x => x.liabilities?.nonCurrent?.longTermPayables?.accountsPayable,
        },
        {
          name: 'Materials Payable',
          chartId: 'NCL MATERIALS PAYABLE',
          value: x => x.liabilities?.nonCurrent?.longTermPayables?.materialsPayable,
        },
        {
          name: 'Loans Principal',
          chartId: 'NCL LOANS PRINCIPAL',
          value: x => x.liabilities?.nonCurrent?.longTermPayables?.loansPrincipal,
        },
      ],
    },
  ],
}));

const equity = computed<SectionData>(() => ({
  name: 'Equity',
  chartId: 'EQUITY',
  coloredChange: true,
  value: summary.calcEquity,
  children: [
    {
      name: 'Total Assets',
      chartId: 'TOTAL ASSETS',
      value: summary.calcTotalAssets,
    },
    {
      name: 'Total Liabilities',
      chartId: 'TOTAL LIABILITIES',
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
        <th />
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
table tr > :not(:first-child) {
  text-align: right;
}
</style>
