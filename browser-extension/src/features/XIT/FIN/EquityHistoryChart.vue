<script setup lang="ts">
import { computed, ref } from 'vue';
import { finHistory } from '@src/core/financials';
import { settings } from '@src/store/settings';
import LineChart from '@src/features/XIT/FIN/LineChart.vue';
import { percent0 } from '@src/utils/format';

defineProps({
  maintainAspectRatio: Boolean,
});

const emit = defineEmits<{ (e: 'chart-click'): void }>();

const averageFactor = ref(0.2);

const lineChartData = computed(() => {
  const date: number[] = [];
  const equity: number[] = [];

  for (const entry of finHistory) {
    const equityValue = entry[1] + entry[2] + entry[3] - entry[4];
    if (equityValue == 0) {
      continue;
    }

    date.push(entry[0]);
    equity.push(Number(equityValue.toPrecision(4)));
  }

  return {
    date,
    equity,
  };
});
</script>

<template>
  <div :class="$style.wide">Smoothing: {{ percent0(averageFactor) }}</div>
  <input
    v-model="averageFactor"
    :class="$style.wide"
    type="range"
    name="volume"
    min="0"
    max="1"
    step="0.01" />
  <LineChart
    :maintain-aspect-ratio="maintainAspectRatio"
    :average-factor="averageFactor"
    :yprefix="settings.fin.currency"
    :ydata="lineChartData.equity"
    :xdata="lineChartData.date"
    @click="emit('chart-click')" />
</template>

<style module>
.wide {
  width: 100%;
  text-align: center;
}
</style>
