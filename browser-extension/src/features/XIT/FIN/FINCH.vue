<script setup lang="ts">
import FinHeader from '@src/features/XIT/FIN/FinHeader.vue';
import EquityHistoryChart from '@src/features/XIT/FIN/EquityHistoryChart.vue';
import AssetPieChart from '@src/features/XIT/FIN/AssetPieChart.vue';
import LocationsPieChart from '@src/features/XIT/FIN/LocationsPieChart.vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { cxStore } from '@src/infrastructure/fio/cx';
import { computed } from 'vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

const props = defineProps({
  parameters: {
    type: Array<string>,
    required: true,
  },
});

const parameter = computed(() => props.parameters[1]?.toUpperCase());
</script>

<template>
  <LoadingSpinner v-if="!cxStore.fetched" />
  <div v-else-if="!parameter">
    <FinHeader>Equity History</FinHeader>
    <div
      :style="{ margin: '5px', marginTop: '10px' }"
      :class="$style.clickable"
      @click="() => showBuffer('XIT FINCH EQUITY')">
      <EquityHistoryChart maintain-aspect-ratio />
    </div>
    <FinHeader>Asset Breakdown</FinHeader>
    <div :style="{ margin: '5px' }">
      <AssetPieChart :class="$style.clickable" @click="() => showBuffer('XIT FINCH ASSETS')" />
      <LocationsPieChart
        :class="$style.clickable"
        @click="() => showBuffer('XIT FINCH LOCATIONS')" />
    </div>
  </div>
  <div v-else :style="{ margin: '5px' }">
    <EquityHistoryChart v-if="parameter === 'EQUITY'" />
    <AssetPieChart v-else-if="parameter === 'ASSETS'" />
    <LocationsPieChart v-else-if="parameter === 'LOCATIONS'" />
    <span v-else>Error: Not a valid chart type</span>
  </div>
</template>

<style module>
.clickable {
  cursor: pointer;
}
</style>
