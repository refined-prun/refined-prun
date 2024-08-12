import {
  ArcElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';

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

type AxisType = 'linear' | 'logarithmic' | 'category' | 'time';

function calculateMovingAverage(data: number[], windowSize: number) {
  if (data.length <= windowSize) {
    return data;
  }

  const movingAverage: (number | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(i - windowSize / 2 + 1, 0);
    const end = Math.min(i + windowSize / 2 + 1, data.length);
    const windowData = data.slice(start, end);
    const sum = windowData.reduce((acc, val) => acc + val, 0);
    movingAverage.push(sum / windowData.length);
  }

  return movingAverage;
}

export function generateLineGraph(
  xdata: Array<number | string | Date>,
  ydata: number[],
  xlabel: string,
  ylabel: string,
  plotWidth: number,
  plotHeight: number,
  xtype: AxisType = 'linear',
  ytype: AxisType = 'linear',
  xprefix = '',
  yprefix = '',
  xformat = '',
) {
  const graph: HTMLCanvasElement = document.createElement('canvas');
  graph.width = plotWidth;
  graph.height = plotHeight;
  const movingAverageData = calculateMovingAverage(ydata, 10);

  const ctx = graph.getContext('2d') as CanvasRenderingContext2D;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: xdata,
      datasets: [
        {
          label: ylabel,
          data: ydata,
          borderColor: '#f7a600',
          fill: false,
          pointRadius: 0.5,
          pointBackgroundColor: '#f7a600',
          showLine: false,
        },
        {
          label: undefined,
          data: movingAverageData,
          borderColor: '#f7a600',
          fill: false,
          pointRadius: 0,
          pointHitRadius: 0,
        },
      ],
    },
    options: {
      responsive: false,
      scales: {
        x: {
          type: xtype,
          title: {
            display: true,
            text: xlabel,
            color: 'rgb(238, 238, 238)',
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
            color: 'rgb(238, 238, 238)',
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
                return `${yprefix + (value / 1_000_000).toFixed(0)}M`;
              }
              return yprefix + value;
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
                  .replace('$', yprefix);
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
    },
  });

  return graph;
}

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

Chart.register(PieController, ArcElement, Tooltip, Legend, CategoryScale);

export function generatePieChart(
  labelData: string[],
  numericalData: number[],
  plotWidth: number,
  plotHeight: number,
): HTMLCanvasElement {
  let i: number;
  let colorScheme: string[] = [...DefaultColors];

  // Extend the color scheme if there are more labels
  for (i = 0; i < labelData.length / 8; i++) {
    colorScheme = colorScheme.concat(DefaultColors);
  }

  // Limit labels after the 20th item to 'Other'
  for (i = 20; i < labelData.length; i++) {
    labelData[i] = 'Other';
  }

  const graph: HTMLCanvasElement = document.createElement('canvas');
  graph.width = plotWidth;
  graph.height = plotHeight;

  const ctx = graph.getContext('2d') as CanvasRenderingContext2D;

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labelData,
      datasets: [
        {
          data: numericalData,
          backgroundColor: colorScheme,
          hoverOffset: 4,
          borderWidth: 0,
        },
      ],
    },
    options: {
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
              const total = numericalData.reduce((a, b) => a + b, 0);
              const percentage = `${((value / total) * 100).toFixed(2)}%`;
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
        padding: 20,
      },
    },
    plugins: [ChartDataLabels],
  });

  return graph;
}
