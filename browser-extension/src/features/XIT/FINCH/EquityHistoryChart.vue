<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import LineChart from '@src/features/XIT/FINCH/LineChart.vue';
import { percent0 } from '@src/utils/format';
import { userData } from '@src/store/user-data';
import { calcEquity } from '@src/core/balance/balance-sheet-summary';
import { balanceHistory } from '@src/store/user-data-balance';
import { useTileState } from '@src/store/user-data-tiles';
import dayjs from 'dayjs';

defineProps({
  pan: Boolean,
  zoom: Boolean,
  maintainAspectRatio: Boolean,
});

const emit = defineEmits<{ (e: 'chart-click'): void }>();

const averageFactor = useTileState('averageFactor', 0.2);
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
    const equity = calcEquity(entry);
    if (equity === undefined) {
      continue;
    }

    const previousDay = date[date.length - 1];
    if (previousDay && dayjs(previousDay).isSame(entry.timestamp, 'day')) {
      date[date.length - 1] = entry.timestamp;
      equityValues[equityValues.length - 1] = equity;
    } else {
      date.push(entry.timestamp);
      equityValues.push(equity);
    }
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
