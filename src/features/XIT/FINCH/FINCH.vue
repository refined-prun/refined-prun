<script setup lang="ts">
import FinHeader from '@src/features/XIT/FIN/FinHeader.vue';
import HistoryChart from '@src/features/XIT/FINCH/HistoryChart.vue';
import AssetPieChart from '@src/features/XIT/FINCH/AssetPieChart.vue';
import LocationsPieChart from '@src/features/XIT/FINCH/LocationsPieChart.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import SectionHeader from '@src/components/SectionHeader.vue';
import { charts } from '@src/features/XIT/FINCH/charts';

const parameters = useXitParameters();
const parameter = parameters.join(' ');

const finch = ref(Math.random() < 0.01);

const chartDef = computed(() => charts.value.find(x => x.value === parameter));
</script>

<template>
  <div :class="$style.root">
    <template v-if="finch">
      <SectionHeader>Finch</SectionHeader>
      <img
        src="https://refined-prun.github.io/assets/finch.jpeg"
        alt="Finch"
        :class="$style.clickable"
        @click="finch = false" />
    </template>
    <template v-else-if="!parameter">
      <div :style="{ marginTop: '5px' }" :class="$style.clickable">
        <HistoryChart />
      </div>
      <FinHeader>Asset Breakdown</FinHeader>
      <div :style="{ marginTop: '5px' }">
        <AssetPieChart :class="$style.clickable" @click="() => showBuffer('XIT FINCH ASSETS')" />
        <LocationsPieChart
          :class="$style.clickable"
          @click="() => showBuffer('XIT FINCH LOCATIONS')" />
      </div>
    </template>
    <template v-else-if="chartDef">
      <HistoryChart :chart-def="chartDef" />
    </template>
    <template v-else>
      <AssetPieChart v-if="parameter === 'ASSETS'" />
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
