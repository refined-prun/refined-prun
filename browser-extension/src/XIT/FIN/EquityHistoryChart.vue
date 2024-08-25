<script setup lang="ts">
import { computed } from 'vue';
import { finHistory } from '@src/core/financials';
import { settings } from '@src/store/settings';
import LineChart from '@src/XIT/FIN/LineChart.vue';

defineProps({
  maintainAspectRatio: Boolean,
});

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
  <LineChart
    :maintain-aspect-ratio="maintainAspectRatio"
    :yprefix="settings.fin.currency"
    :ydata="lineChartData.equity"
    :xdata="lineChartData.date" />
</template>
