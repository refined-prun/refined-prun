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
import { fixed0, hhmm, ddmm, ddmmyyyy } from '@src/utils/format';

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
  averageFactor: {
    type: Number,
    default: 0.2,
  },
  pan: Boolean,
  zoom: Boolean,
  maintainAspectRatio: Boolean,
});

const sortedYData = computed(() => props.ydata.slice().sort((a, b) => a - b));

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
      label: 'Equity',
      data: props.ydata,
      borderColor: '#f7a600',
      fill: false,
      pointRadius: 0.25,
      pointBackgroundColor: '#f7a600',
      showLine: false,
    },
    {
      label: undefined,
      data: calculateMovingAverage(props.ydata, props.averageFactor),
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
        text: 'Equity',
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
            return `${fixed0(value / 1_000_000)}M`;
          }
          return value;
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
          if (!timestamp) {
            return;
          }
          return `${hhmm(timestamp)} ${ddmmyyyy(timestamp)}`;
        },
        label(item): string | void {
          let label = item.dataset.label || '';

          if (label) {
            label += ': ';
          }
          label += props.yprefix + fixed0(item.parsed.y);
          return label;
        },
      },
      filter: tooltip => tooltip.datasetIndex === 0,
    },
    zoom: {
      limits: {
        x: { min: props.xdata[0], max: props.xdata[props.xdata.length - 1] },
        y: { min: 0, max: sortedYData.value[sortedYData.value.length - 1] + sortedYData.value[0] },
      },
      pan: {
        enabled: props.pan,
        mode: 'xy',
        threshold: 5,
      },
      zoom: {
        wheel: {
          enabled: props.zoom,
        },
        pinch: {
          enabled: props.zoom,
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
</script>

<template>
  <div ref="outerContainer" :class="$style.outer">
    <div
      ref="chartContainer"
      :style="{ position: 'relative', width: `${chartWidth}px`, height: `${chartHeight}px` }">
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
