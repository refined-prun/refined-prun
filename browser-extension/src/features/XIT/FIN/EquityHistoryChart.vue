<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import LineChart from '@src/features/XIT/FIN/LineChart.vue';
import { percent0 } from '@src/utils/format';
import { createTileStateHook } from '@src/infrastructure/prun-api/data/tiles';
import { userData } from '@src/store/user-data';
import { calcEquity } from '@src/core/balance/balance-sheet-summary';
import { balanceHistory } from '@src/store/user-data-balance';

defineProps({
  pan: Boolean,
  zoom: Boolean,
  maintainAspectRatio: Boolean,
});

const emit = defineEmits<{ (e: 'chart-click'): void }>();

const useTileState = createTileStateHook({ averageFactor: 0.2 });
const averageFactor = useTileState('averageFactor');
const averageFactorText = ref(averageFactor.value);
watch(averageFactorText, x => {
  const parsed = parseFloat(x);
  if (isFinite(parsed)) {
    averageFactor.value = parsed;
  }
});

const lineChartData = computed(() => {
  const date: number[] = [];
  const equityValues: number[] = [];

  for (const entry of balanceHistory.value) {
    if (!entry) {
      continue;
    }

    date.push(entry.timestamp);
    equityValues.push(calcEquity(entry));
  }

  return {
    date,
    equity: equityValues,
  };
});
</script>

<template>
  <div :class="$style.wide">Smoothing: {{ percent0(averageFactor) }}</div>
  <input
    v-model="averageFactorText"
    :class="$style.wide"
    type="range"
    name="volume"
    min="0"
    max="1"
    step="0.01" />
  <LineChart
    :maintain-aspect-ratio="maintainAspectRatio"
    :average-factor="averageFactor"
    :yprefix="userData.settings.currency"
    :ydata="lineChartData.equity"
    :xdata="lineChartData.date"
    :pan="pan"
    :zoom="zoom"
    @click="emit('chart-click')" />
</template>

<style module>
.wide {
  width: 100%;
  text-align: center;
}
</style>
