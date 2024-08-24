<script setup lang="ts">
import FinHeader from '@src/XIT/FIN/FinHeader.vue';
import { showBuffer } from '@src/util';
import EquityHistoryChart from '@src/XIT/FIN/EquityHistoryChart.vue';
import AssetPieChart from '@src/XIT/FIN/AssetPieChart.vue';
import LocationsPieChart from '@src/XIT/FIN/LocationsPieChart.vue';
</script>

<template>
  <FinHeader>Equity History</FinHeader>
  <div
    :style="{ margin: '5px', marginTop: '10px' }"
    :class="$style.clickable"
    @click="() => showBuffer('XIT FIN CHART HISTORY')">
    <EquityHistoryChart maintain-aspect-ratio />
  </div>
  <FinHeader>Asset Breakdown</FinHeader>
  <div :style="{ margin: '5px' }">
    <AssetPieChart :class="$style.clickable" @click="() => showBuffer('XIT FIN CHART ASSETPIE')" />
    <LocationsPieChart
      :class="$style.clickable"
      @click="() => showBuffer('XIT FIN CHART LOCATIONSPIE')" />
  </div>
</template>

<style module>
.clickable {
  cursor: pointer;
}
</style>
