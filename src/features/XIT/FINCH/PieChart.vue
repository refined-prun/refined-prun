<script setup lang="ts">
import { Pie } from 'vue-chartjs';
import {
  ArcElement,
  CategoryScale,
  Chart,
  ChartData,
  ChartOptions,
  Legend,
  PieController,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { sumBy } from '@src/utils/sum-by';
import { percent2 } from '@src/utils/format';

Chart.register(PieController, ArcElement, Tooltip, Legend, CategoryScale);

const { labelData, numericalData } = defineProps<{
  labelData: string[];
  numericalData: number[];
}>();

const DefaultColors = [
  '#004564',
  '#005b76',
  '#007079',
  '#00846c',
  '#009552',
  '#67a22e',
  '#ada900',
  '#f7a600',
];

const colorScheme = computed(() => {
  let colorScheme = [...DefaultColors];

  for (let i = 0; i < labelData.length / 8; i++) {
    colorScheme = colorScheme.concat(DefaultColors);
  }

  return colorScheme;
});

const truncatedLabelData = computed(() => {
  let truncatedLabelData = [...labelData];

  for (let i = 20; i < truncatedLabelData.length; i++) {
    truncatedLabelData[i] = 'Other';
  }

  return truncatedLabelData;
});

const chartData = computed<ChartData<'pie', number[], string>>(() => ({
  labels: truncatedLabelData.value,
  datasets: [
    {
      data: numericalData,
      backgroundColor: colorScheme.value,
      hoverOffset: 4,
      borderWidth: 0,
    },
  ],
}));

const chartOptions = computed<ChartOptions<'pie'>>(() => ({
  responsive: false,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label(context) {
          const label = context.label || '';
          const value = context.raw as number;
          const total = sumBy(numericalData, x => x);
          const percentage = percent2(value / total);
          return `${label}: ${percentage}`;
        },
      },
    },
    datalabels: {
      color: '#cccccc',
      display: 'auto',
      formatter(value, context) {
        return context.chart.data.labels![context.dataIndex];
      },
      anchor: 'end',
      align: 'end',
      textAlign: 'center',
      font: {
        weight: 'normal',
        size: 11,
      },
    },
  },
  layout: {
    padding: {
      left: 60,
      top: 0,
      right: 60,
      bottom: 0,
    },
  },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chartPlugins = [ChartDataLabels as any];
</script>

<template>
  <Pie :options="chartOptions" :data="chartData" :plugins="chartPlugins" />
</template>
