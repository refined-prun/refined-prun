<script setup lang="ts">
import LineChart from '@src/features/XIT/FINCH/LineChart.vue';
import { percent0 } from '@src/utils/format';
import { balanceHistory } from '@src/store/user-data-balance';
import { useTileState } from '@src/store/user-data-tiles';
import dayjs from 'dayjs';
import RangeInput from '@src/components/forms/RangeInput.vue';
import Active from '@src/components/forms/Active.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import { ChartDef, charts } from '@src/features/XIT/FINCH/charts';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import Passive from '@src/components/forms/Passive.vue';

const { chartDef } = defineProps<{ chartDef?: ChartDef }>();

const maintainAspectRatio = computed(() => !chartDef);
const pan = computed(() => !!chartDef);
const zoom = computed(() => !!chartDef);

const averageFactor = useTileState('averageFactor', 0.1);
const averageFactorText = ref(averageFactor.value);
watch(averageFactorText, x => {
  const parsed = typeof x === 'number' ? x : parseFloat(x);
  if (isFinite(parsed)) {
    averageFactor.value = parsed;
  }
});

const selectedChart = useTileState('selectedChart', 'EQUITY');
const selectedChartDef = computed(
  () => chartDef ?? charts.value.find(x => x.value === selectedChart.value),
);
const yLabel = computed(() => {
  let label = selectedChartDef.value?.label;
  if (!label) {
    return 'Value';
  }
  while (label.startsWith('-') || label.startsWith(' ')) {
    label = label.slice(1);
  }
  return label;
});

const lineChartData = computed(() => {
  const date: number[] = [];
  const equityValues: number[] = [];
  if (!selectedChartDef.value) {
    return {
      date,
      equity: equityValues,
    };
  }

  for (const entry of balanceHistory.value) {
    const value = selectedChartDef.value.getValue(entry);
    if (value === undefined) {
      continue;
    }

    const previousDay = date[date.length - 1];
    if (previousDay !== undefined && dayjs(previousDay).isSame(entry.timestamp, 'day')) {
      date[date.length - 1] = entry.timestamp;
      equityValues[equityValues.length - 1] = value;
    } else {
      date.push(entry.timestamp);
      equityValues.push(value);
    }
  }

  return {
    date,
    equity: equityValues,
  };
});

function onChartClick() {
  if (!chartDef) {
    showBuffer(`XIT FINCH ${selectedChart.value}`);
  }
}
</script>

<template>
  <form>
    <Passive v-if="chartDef" label="Chart">
      <span>{{ yLabel }}</span>
    </Passive>
    <Active v-else label="Chart">
      <SelectInput v-model="selectedChart" :options="charts" />
    </Active>
    <Active :label="`Smoothing: ${percent0(averageFactor)}`">
      <RangeInput v-model="averageFactorText" :class="$style.wide" :min="0" :max="1" :step="0.01" />
    </Active>
  </form>
  <LineChart
    :maintain-aspect-ratio="maintainAspectRatio"
    :average-factor="averageFactor"
    :ydata="lineChartData.equity"
    :xdata="lineChartData.date"
    :y-label="yLabel"
    :pan="pan"
    :zoom="zoom"
    @click="onChartClick" />
</template>

<style module>
.wide {
  width: 100%;
}
</style>
