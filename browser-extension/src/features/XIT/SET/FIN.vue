<script setup lang="ts">
import SectionHeader from '@src/components/SectionHeader.vue';
import Tooltip from '@src/components/Tooltip.vue';
import Commands from '@src/components/forms/Commands.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { computed } from 'vue';
import { fixed0, hhmm, ddmmyyyy } from '@src/utils/format';
import { clearBalanceHistory, deleteBalanceHistoryDataPoint, userData } from '@src/store/user-data';
import { calcEquity } from '@src/core/balance/balance-sheet-summary';
import { showConfirmationOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import { downloadJson } from '@src/utils/download-json';
import { balanceHistory, collectFinDataPoint } from '@src/store/user-data-balance';

const sortedData = computed(() => balanceHistory.value.slice().reverse());

function exportData() {
  downloadJson(userData.balanceHistory, `refined-prun-fin-${Date.now()}.json`);
}

function confirmDataPointDelete(ev: Event, index: number) {
  index = balanceHistory.value.length - index - 1;
  showConfirmationOverlay(ev, () => deleteBalanceHistoryDataPoint(index), {
    message: `You are about to delete a historical data point. Do you want to continue?`,
  });
}

function confirmAllDataDelete(ev: Event) {
  showConfirmationOverlay(ev, clearBalanceHistory, {
    message: `You are about to clear all historical financial data. Do you want to continue?`,
  });
}
</script>

<template>
  <SectionHeader>
    Import/Export Data
    <Tooltip :class="$style.tooltip" tooltip="Import or export financial data to a json file" />
  </SectionHeader>
  <form>
    <Commands>
      <PrunButton primary>Import Data</PrunButton>
      <PrunButton primary @click="exportData">Export Data</PrunButton>
    </Commands>
  </form>
  <SectionHeader>
    Collected Data
    <Tooltip :class="$style.tooltip" tooltip="All collected data points" />
  </SectionHeader>
  <form>
    <Commands>
      <PrunButton primary @click="collectFinDataPoint">Collect Data Point</PrunButton>
    </Commands>
  </form>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Equity</th>
        <th>Command</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(balance, i) in sortedData" :key="i">
        <td>{{ hhmm(balance.timestamp) }} on {{ ddmmyyyy(balance.timestamp) }}</td>
        <td>{{ fixed0(calcEquity(balance)) }}</td>
        <td>
          <PrunButton dark inline @click="confirmDataPointDelete($event, i)">delete</PrunButton>
        </td>
      </tr>
    </tbody>
  </table>
  <SectionHeader>
    Danger Zone
    <Tooltip :class="$style.tooltip" tooltip="Clear all current and historical financial data." />
  </SectionHeader>
  <form>
    <Commands>
      <PrunButton danger @click="confirmAllDataDelete">Clear Financial Data</PrunButton>
    </Commands>
  </form>
</template>

<style module>
.tooltip {
  float: revert;
  font-size: 12px;
  margin-top: -4px;
}
</style>
