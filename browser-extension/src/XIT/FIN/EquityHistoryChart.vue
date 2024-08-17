<script setup lang="ts">
import { Line } from 'vue-chartjs';
import { format } from 'date-fns';
import { computed, onMounted, ref } from 'vue';
import 'chartjs-adapter-date-fns';
import {
  CategoryScale,
  Chart,
  ChartData,
  ChartOptions,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  CategoryScale,
  TimeScale,
);

const props = defineProps({
  xdata: {
    type: Array<number>,
    required: true,
  },
  ydata: {
    type: Array<number>,
    required: true,
  },
  yprefix: {
    type: String,
    required: true,
  },
  maintainAspectRatio: Boolean,
});

type AxisType = 'linear' | 'logarithmic' | 'category' | 'time';

const ylabel = 'Equity';
const xlabel = 'Date';
const xtype: AxisType = 'time';
const ytype: AxisType = 'linear';
const xprefix = '';
const xformat = 'dd/MM';

const averageFactor = ref(0.2);

function calculateMovingAverage(data: number[], factor: number) {
  factor = Math.min(Math.max(factor, 0), 1);
  const windowSize = Math.max(Math.floor(factor * data.length), 1);
  if (windowSize === 1) {
    return data;
  }

  const halfWindow = Math.floor(windowSize / 2);
  const movingAverage: number[] = [];

  movingAverage.push(data[0]);

  let sum = data[0];
  let start = 0;
  let end = 0;

  for (let i = 1; i < data.length; i++) {
    let chunkStart = i - halfWindow;
    let chunkEnd = i + halfWindow;

    if (chunkStart < 0) {
      chunkEnd += chunkStart;
      chunkStart = 0;
    } else if (chunkEnd >= data.length) {
      chunkStart += chunkEnd - data.length + 1;
      chunkEnd = data.length - 1;
      if (chunkStart === chunkEnd) {
        chunkStart = chunkEnd - 1;
      }
    }

    while (chunkStart > start) {
      sum -= data[start++];
    }

    while (chunkEnd > end) {
      sum += data[++end];
    }

    movingAverage.push(sum / (end - start + 1));
  }

  return movingAverage;
}

const chartData = computed<ChartData<'line', number[], number | string | Date>>(() => ({
  labels: props.xdata,
  datasets: [
    {
      label: ylabel,
      data: props.ydata,
      borderColor: '#f7a600',
      fill: false,
      pointRadius: 0.5,
      pointBackgroundColor: '#f7a600',
      showLine: false,
    },
    {
      label: undefined,
      data: calculateMovingAverage(props.ydata, averageFactor.value),
      borderColor: '#f7a600',
      fill: false,
      pointRadius: 0,
      pointHitRadius: 0,
    },
  ],
}));

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  maintainAspectRatio: props.maintainAspectRatio,
  scales: {
    x: {
      type: xtype,
      title: {
        display: true,
        text: xlabel,
        color: '#eeeeee',
        font: {
          family: '"Droid Sans", sans-serif',
        },
      },
      grid: {
        color: '#505050',
      },
      ticks: {
        color: '#999',
        callback(value: string | number) {
          if (xtype === 'time') {
            const dateValue = new Date(value);
            return xprefix + format(dateValue, xformat || 'dd/MM/yyyy');
          }
          return xprefix + value;
        },
      },
    },
    y: {
      type: ytype,
      title: {
        display: true,
        text: ylabel,
        color: '#eeeeee',
        font: {
          family: '"Droid Sans", sans-serif',
        },
      },
      grid: {
        color: '#505050',
      },
      ticks: {
        color: '#999',
        callback(value: string | number) {
          if (typeof value === 'number') {
            return `${props.yprefix + (value / 1_000_000).toFixed(0)}M`;
          }
          return props.yprefix + value;
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
      callbacks: {
        label(context): string | void {
          let label = context.dataset.label || '';

          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })
              .format(context.parsed.y)
              .replace('$', props.yprefix);
          }
          return label;
        },
      },
      filter: tooltip => tooltip.datasetIndex === 0,
    },
  },
  elements: {
    point: {
      radius: 0,
    },
  },
}));

const outerContainer = ref<HTMLDivElement | undefined>(undefined);
const chartContainer = ref<HTMLDivElement | undefined>(undefined);
const chartWidth = ref(400);
const chartHeight = ref(200);

onMounted(() => {
  const container = outerContainer.value!;
  const resizeObserver = new ResizeObserver(() => {
    chartWidth.value = container.clientWidth;
    chartHeight.value = props.maintainAspectRatio
      ? container.clientWidth / 2
      : container.clientHeight;
  });

  resizeObserver.observe(container);
});

const formatPercent = new Intl.NumberFormat('default', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
</script>

<template>
  <div :class="$style.wide">Smoothing: {{ formatPercent.format(averageFactor) }}</div>
  <input
    v-model="averageFactor"
    :class="$style.wide"
    type="range"
    name="volume"
    min="0"
    max="1"
    step="0.01" />
  <div ref="outerContainer">
    <div
      ref="chartContainer"
      class="chart-container"
      :style="{ position: 'relative', width: `${chartWidth}px`, height: `${chartHeight}px` }">
      <Line :options="chartOptions" :data="chartData" />
    </div>
  </div>
</template>

<style module>
.wide {
  width: 100%;
  text-align: center;
}
</style>
