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
import BalanceSheetSection from '@src/features/XIT/FIN/BalanceSheetSection.vue';
import {
  calcCompanyValue,
  calcEquity,
  calcTotalAssets,
  calcTotalCurrentAssets,
  calcTotalCurrentLiabilities,
  calcTotalLiabilities,
  calcTotalLockedAssets,
  calcTotalNonCurrentAssets,
  calcTotalNonCurrentLiabilities,
} from '@src/core/balance/balance-sheet-summary';
import { map } from '@src/utils/map-values';
import { SectionData } from '@src/features/XIT/FIN/balance-section';
import { liveBalanceSheet } from '@src/core/balance/balance-sheet-live';
import { balanceHistory } from '@src/store/user-data-balance';
import dayjs from 'dayjs';
import { timestampEachMinute } from '@src/utils/dayjs';
import { ddmmyyyy } from '@src/utils/format';

const currentAssets = computed<SectionData>(() => ({
  name: 'Current Assets',
  total: calcTotalCurrentAssets,
  rows: [
    ['Cash', x => x.currentAssets?.cash],
    ['Deposits', x => x.currentAssets?.deposits],
    ['Interest Receivable', x => x.currentAssets?.interestReceivable],
    ['Accounts Receivable', x => x.currentAssets?.accountsReceivable],
    ['Short-Term Loans', x => x.currentAssets?.shortTermLoans],
    ['Market-Listed Materials', x => x.currentAssets?.marketListedMaterials],
    ['Inventory', x => x.currentAssets?.inventory],
    ['Work-in-Progress (WIP)', x => x.currentAssets?.ordersInProgress],
    ['Materials to Receive', x => x.currentAssets?.materialsToReceive],
  ],
}));

const nonCurrentAssets = computed<SectionData>(() => ({
  name: 'Non-Current Assets',
  total: calcTotalNonCurrentAssets,
  rows: [
    ['Buildings', x => x.nonCurrentAssets?.buildings],
    ['Accounts Receivable', x => x.nonCurrentAssets?.accountsReceivable],
    ['Long-Term Loans', x => x.nonCurrentAssets?.longTermLoans],
    ['Materials to Receive', x => x.nonCurrentAssets?.materialsToReceive],
  ],
}));

const currentLiabilities = computed<SectionData>(() => ({
  name: 'Current Liabilities',
  total: calcTotalCurrentLiabilities,
  rows: [
    ['Accounts Payable', x => x.currentLiabilities?.accountsPayable],
    ['Materials to Deliver', x => x.currentLiabilities?.materialsToDeliver],
    ['Short-Term Debt', x => x.currentLiabilities?.shortTermDebt],
    ['Interest Payable', x => x.currentLiabilities?.interestPayable],
  ],
}));

const nonCurrentLiabilities = computed<SectionData>(() => ({
  name: 'Non-Current Liabilities',
  total: calcTotalNonCurrentLiabilities,
  rows: [
    ['Accounts Payable', x => x.nonCurrentLiabilities?.accountsPayable],
    ['Materials to Deliver', x => x.nonCurrentLiabilities?.materialsToDeliver],
    ['Long-Term Debt', x => x.nonCurrentLiabilities?.longTermDebt],
  ],
}));

const equity = computed<SectionData>(() => ({
  name: 'Equity',
  important: true,
  total: calcEquity,
  rows: [
    ['Total Assets', calcTotalAssets],
    ['Total Liabilities', x => map([calcTotalLiabilities(x)], y => -y)],
  ],
}));

const lockedAssets = computed<SectionData>(() => ({
  name: 'Locked Assets',
  total: calcTotalLockedAssets,
  rows: [
    ['Ships', x => x.lockedAssets?.ships],
    ['HQ Upgrades', x => x.lockedAssets?.hqUpgrades],
    ['APEX Representation Center', x => x.lockedAssets?.arc],
  ],
}));

const companyValue = computed<SectionData>(() => ({
  name: 'Company Value',
  important: true,
  total: calcCompanyValue,
  rows: [
    ['Equity', calcEquity],
    ['Locked Assets', calcTotalLockedAssets],
  ],
}));

const sections = [
  currentAssets,
  nonCurrentAssets,
  currentLiabilities,
  nonCurrentLiabilities,
  equity,
  lockedAssets,
  companyValue,
];

const last = computed(() => {
  // Touch timestampEachMinute to trigger reactivity,
  // but use Date.now() instead because the most recent
  // history entry can be more recent than a minute ago.
  const _ = timestampEachMinute.value;
  const now = Date.now();
  const dayjsNow = dayjs(now);
  const history = balanceHistory.value;
  for (let i = history.length - 1; i >= 0; i--) {
    const timestamp = history[i].timestamp;
    if (now < timestamp) {
      return undefined;
    }
    if (!dayjsNow.isSame(timestamp, 'isoWeek')) {
      return history[i];
    }
  }
  return undefined;
});

const previous = computed(() => {
  if (!last.value) {
    return undefined;
  }
  // Touch timestampEachMinute to trigger reactivity,
  // but use Date.now() instead because the most recent
  // history entry can be more recent than a minute ago.
  const _ = timestampEachMinute.value;
  const lastTimestamp = last.value.timestamp;
  const lastDayjs = dayjs(lastTimestamp);
  const now = Date.now();
  const history = balanceHistory.value;
  for (let i = history.length - 1; i >= 0; i--) {
    const timestamp = history[i].timestamp;
    if (now < timestamp) {
      return undefined;
    }
    if (last.value.timestamp < timestamp) {
      continue;
    }
    if (!lastDayjs.isSame(timestamp, 'isoWeek')) {
      return history[i];
    }
  }
  return undefined;
});
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th>Current Period</th>
        <th>
          <template v-if="last">{{ ddmmyyyy(last.timestamp) }}</template>
          <template v-else>Last Period</template>
        </th>
        <th>
          <template v-if="last">{{ ddmmyyyy(previous.timestamp) }}</template>
          <template v-else>Previous Period</template>
        </th>
        <th>Change</th>
      </tr>
    </thead>
    <BalanceSheetSection
      v-for="section in sections"
      :key="section.value.name"
      :current="liveBalanceSheet"
      :last="last"
      :previous="previous"
      :section="section.value" />
  </table>
</template>

<style scoped>
table tr > *:not(:first-child) {
  text-align: right;
}
</style>
