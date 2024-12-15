<script setup lang="ts">
import SectionHeader from '@src/components/SectionHeader.vue';
import Tooltip from '@src/components/Tooltip.vue';
import Commands from '@src/components/forms/Commands.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { fixed0, hhmm, ddmmyyyy } from '@src/utils/format';
import { clearBalanceHistory, userData } from '@src/store/user-data';
import { calcEquity } from '@src/core/balance/balance-sheet-summary';
import { showConfirmationOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import {
  balanceHistory,
  canCollectFinDataPoint,
  collectFinDataPoint,
} from '@src/store/user-data-balance';
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';

const sortedData = computed(() => balanceHistory.value.slice().reverse());

function confirmDataPointDelete(ev: Event, index: number) {
  index = balanceHistory.value.length - index - 1;
  showConfirmationOverlay(ev, () => deleteBalanceHistoryDataPoint(index), {
    message: `You are about to delete a historical data point. Do you want to continue?`,
  });
}

function deleteBalanceHistoryDataPoint(index: number) {
  const history = userData.balanceHistory;
  if (index < history.v1.length) {
    history.v1.splice(index, 1);
  } else {
    history.v2.splice(index - history.v1.length, 1);
  }
}

function confirmAllDataDelete(ev: Event) {
  showConfirmationOverlay(ev, clearBalanceHistory, {
    message: `You are about to clear all historical financial data. Do you want to continue?`,
  });
}

function formatValue(number?: number) {
  return number ? fixed0(number) : '--';
}

const mmMaterials = ref(userData.settings.financial.mmMaterials);

function onMMMaterialsSubmit() {
  const formatted = (mmMaterials.value ?? '').replaceAll(' ', '').toUpperCase();
  userData.settings.financial.mmMaterials = formatted;
  mmMaterials.value = formatted;
}

const ignoredMaterials = ref(userData.settings.financial.ignoredMaterials);

function onIgnoredMaterialsSubmit() {
  const formatted = (ignoredMaterials.value ?? '').replaceAll(' ', '').toUpperCase();
  userData.settings.financial.ignoredMaterials = formatted;
  ignoredMaterials.value = formatted;
}
</script>

<template>
  <SectionHeader>Price Settings</SectionHeader>
  <Active
    label="MM Materials"
    tooltip="Comma-separated list of Market Maker materials.
     The price of these materials will be equal to MM Bid price.">
    <TextInput
      v-model="mmMaterials"
      @keyup.enter="onMMMaterialsSubmit"
      @focusout="onMMMaterialsSubmit" />
  </Active>
  <Active
    label="Ignored Materials"
    tooltip="Comma-separated list of ignored materials.
     The price of these materials is considered to be zero.">
    <TextInput
      v-model="ignoredMaterials"
      @keyup.enter="onIgnoredMaterialsSubmit"
      @focusout="onIgnoredMaterialsSubmit" />
  </Active>
  <SectionHeader>Collected Data Points</SectionHeader>
  <form>
    <Commands>
      <PrunButton primary :disabled="!canCollectFinDataPoint()" @click="collectFinDataPoint">
        Collect Data Point
      </PrunButton>
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
        <td>{{ hhmm(balance.timestamp) }} {{ ddmmyyyy(balance.timestamp) }}</td>
        <td>{{ formatValue(calcEquity(balance)) }}</td>
        <td>
          <PrunButton dark inline @click="confirmDataPointDelete($event, i)">delete</PrunButton>
        </td>
      </tr>
    </tbody>
  </table>
  <SectionHeader>
    Danger Zone
    <Tooltip :class="$style.tooltip" tooltip="Clear all historical financial data" />
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
