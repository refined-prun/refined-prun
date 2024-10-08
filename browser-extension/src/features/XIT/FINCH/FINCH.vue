<script lang="ts">
import xit from '@src/features/XIT/xit-registry.js';
import FINCH from '@src/features/XIT/FINCH/FINCH.vue';

xit.add({
  command: ['FINCH'],
  name: 'Financial Charts',
  contextItems: () => [{ cmd: 'XIT FIN' }, { cmd: 'XIT FINPR' }, { cmd: 'XIT SET FIN' }],
  component: () => FINCH,
});
</script>

<script setup lang="ts">
import FinHeader from '@src/features/XIT/FIN/FinHeader.vue';
import EquityHistoryChart from '@src/features/XIT/FINCH/EquityHistoryChart.vue';
import AssetPieChart from '@src/features/XIT/FINCH/AssetPieChart.vue';
import LocationsPieChart from '@src/features/XIT/FINCH/LocationsPieChart.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { useXitParameters } from '@src/hooks/useXitParameters';

const parameters = useXitParameters();
const parameter = parameters[0]?.toUpperCase();
</script>

<template>
  <div :class="$style.root">
    <template v-if="!parameter">
      <FinHeader>Equity History</FinHeader>
      <div :style="{ marginTop: '5px' }" :class="$style.clickable">
        <EquityHistoryChart
          maintain-aspect-ratio
          @chart-click="() => showBuffer('XIT FINCH EQUITY')" />
      </div>
      <FinHeader>Asset Breakdown</FinHeader>
      <div :style="{ marginTop: '5px' }">
        <AssetPieChart :class="$style.clickable" @click="() => showBuffer('XIT FINCH ASSETS')" />
        <LocationsPieChart
          :class="$style.clickable"
          @click="() => showBuffer('XIT FINCH LOCATIONS')" />
      </div>
    </template>
    <template v-else>
      <EquityHistoryChart v-if="parameter === 'EQUITY'" pan zoom />
      <AssetPieChart v-else-if="parameter === 'ASSETS'" />
      <LocationsPieChart v-else-if="parameter === 'LOCATIONS'" />
      <span v-else>Error: Not a valid chart type</span>
    </template>
  </div>
</template>

<style module>
.root {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: 5px;
  display: flex;
  flex-direction: column;
}

.clickable {
  cursor: pointer;
}
</style>
