<script setup lang="ts">
import SectionHeader from '@src/components/SectionHeader.vue';
import Tooltip from '@src/components/Tooltip.vue';
import Commands from '@src/components/forms/Commands.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { computed } from 'vue';
import { finHistory } from '@src/core/financials';
import { fixed0, hhmm, mmddyyyy } from '@src/utils/format';

const sortedData = computed(() => finHistory.slice().reverse());
// You are about to clear all current and historical financial data. Do you want to continue?
</script>

<template>
  <SectionHeader>
    Import/Export Data
    <Tooltip :class="$style.tooltip" tooltip="Import or export financial data to a json file" />
  </SectionHeader>
  <form>
    <Commands>
      <PrunButton primary>Import Data</PrunButton>
      <PrunButton primary>Export Data</PrunButton>
    </Commands>
  </form>
  <SectionHeader>
    Collected Data
    <Tooltip :class="$style.tooltip" tooltip="All collected data points" />
  </SectionHeader>
  <form>
    <Commands>
      <PrunButton primary>Collect Data Point</PrunButton>
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
      <tr v-for="(data, i) in sortedData" :key="i">
        <td>{{ hhmm(data[0]) }} on {{ mmddyyyy(data[0]) }}</td>
        <td>{{ fixed0(data[1] + data[2] + data[3] - data[4]) }}</td>
        <td>
          <PrunButton dark inline>delete</PrunButton>
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
      <PrunButton danger>Clear Financial Data</PrunButton>
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
