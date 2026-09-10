<script setup lang="ts">
import { Line } from 'vue-chartjs';
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
import zoomPlugin from 'chartjs-plugin-zoom';
import { fixed0, fixed01, hhmm, ddmm, ddmmyyyy, formatCurrency, percent2 } from '@src/utils/format';

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

const {
  averageFactor = 0.2,
  maintainAspectRatio,
  pan,
  unit = 'currency',
  xdata,
  ydata,
  yLabel,
  zoom,
} = defineProps<{
  averageFactor?: number;
  maintainAspectRatio?: boolean;
  pan?: boolean;
  unit?: 'currency' | 'percent';
  xdata: number[];
  ydata: number[];
  yLabel?: string;
  zoom?: boolean;
}>();

const sortedYData = computed(() => ydata.slice().sort((a, b) => a - b));
const minY = computed(() => sortedYData.value[0] ?? 0);
const maxY = computed(() => sortedYData.value[sortedYData.value.length - 1] ?? 0);

// Growth rates sit close to zero, so two decimals keep neighbouring axis ticks
// distinct instead of collapsing them into a run of identical labels.
function formatValue(value: number) {
  return unit === 'percent' ? percent2(value) : formatCurrency(value);
}

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
  labels: xdata,
  datasets: [
    {
      label: yLabel,
      data: ydata,
      borderColor: '#f7a600',
      fill: false,
      pointRadius: unit === 'percent' ? 2.5 : 0.25,
      pointBackgroundColor: '#f7a600',
      showLine: false,
    },
    {
      label: undefined,
      data: calculateMovingAverage(ydata, averageFactor),
      borderColor: '#f7a600',
      fill: false,
      pointRadius: 0,
      pointHitRadius: 0,
    },
  ],
}));

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  maintainAspectRatio: maintainAspectRatio,
  scales: {
    x: {
      type: 'time',
      title: {
        display: true,
        text: 'Date',
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
          return ddmm(Number(value));
        },
      },
    },
    y: {
      type: 'linear',
      title: {
        display: true,
        text: yLabel,
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
          if (typeof value !== 'number') {
            return value;
          }
          if (unit === 'percent') {
            return percent2(value);
          }
          if (value >= 1_000_000_000) {
            return formatY(value, 1_000_000_000, 'B');
          }
          if (value >= 1_000_000) {
            return formatY(value, 1_000_000, 'M');
          }
          if (value >= 1_000) {
            return formatY(value, 1_000, 'K');
          }
          return fixed0(value);
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
        title(items): string | void {
          const item = items[0];
          const timestamp = item?.parsed?.x;
          if (timestamp === undefined) {
            return;
          }
          return `${hhmm(timestamp)} ${ddmmyyyy(timestamp)}`;
        },
        label(item): string | void {
          let label = item.dataset.label ?? '';

          if (label) {
            label += ': ';
          }
          label += formatValue(item.parsed.y);
          return label;
        },
      },
      filter: tooltip => tooltip.datasetIndex === 0,
    },
    zoom: {
      limits: {
        x: { min: xdata[0], max: xdata[xdata.length - 1] },
        y: { min: Math.min(0, minY.value * 1.1), max: Math.max(0, maxY.value * 1.1) },
      },
      pan: {
        enabled: pan,
        mode: 'xy',
        threshold: 5,
      },
      zoom: {
        wheel: {
          enabled: zoom,
        },
        pinch: {
          enabled: zoom,
        },
        mode: 'xy',
      },
    },
  },
  elements: {
    point: {
      radius: 0,
    },
  },
}));

function formatY(value: number, divisor: number, suffix: string) {
  const divided = value / divisor;
  if (divided >= 100) {
    return `${fixed0(divided)}${suffix}`;
  } else {
    return `${fixed01(divided)}${suffix}`;
  }
}

const outerContainer = useTemplateRef<HTMLDivElement>('outer-container');
const chartWidth = ref(400);
const chartHeight = ref(200);

onMounted(() => {
  const container = outerContainer.value!;
  const resizeObserver = new ResizeObserver(() => {
    chartWidth.value = container.clientWidth;
    chartHeight.value = maintainAspectRatio ? container.clientWidth / 2 : container.clientHeight;
  });

  resizeObserver.observe(container);
});
</script>

<template>
  <div ref="outer-container" :class="$style.outer">
    <div :style="{ position: 'relative', width: `${chartWidth}px`, height: `${chartHeight}px` }">
      <Line :options="chartOptions" :data="chartData" :plugins="[zoomPlugin]" />
    </div>
  </div>
</template>

<style module>
.outer {
  flex-grow: 1;
  overflow: hidden;
}
</style>
