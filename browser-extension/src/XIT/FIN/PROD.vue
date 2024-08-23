<script setup lang="ts">
import { workforcesStore } from '@src/prun-api/data/workforces';
import { getPlanetNameFromAddress } from '@src/prun-api/data/addresses';
import { productionStore } from '@src/prun-api/data/production';
import { sitesStore } from '@src/prun-api/data/sites';
import { getPrice } from '@src/financials';
import FinHeader from '@src/XIT/FIN/FinHeader.vue';
import { computed } from 'vue';
import { formatAmount, formatNumber } from '@src/XIT/FIN/utils';
import KeyFigures from '@src/XIT/FIN/KeyFigures.vue';
import { cxStore } from '@src/fio/cx';
import PrunCss from '@src/prun-ui/prun-css';

interface ProductionEntry {
  name: string;
  produced: number;
  consumed: number;
  profit: number;
  margin: number;
}

const cxPrices = computed(() => {
  const cx = 'AI1';
  const priceType = 'Average';
  return cxStore.prices![cx]![priceType];
});

const entries = computed<ProductionEntry[]>(() => {
  const entries: ProductionEntry[] = [];
  for (const site of sitesStore.all.value) {
    const production = productionStore.getBySiteId(site.siteId);
    const workforce = workforcesStore.getById(site.siteId);
    let produced = 0;
    let consumed = 0;

    if (workforce) {
      for (const tier of workforce.workforces) {
        for (const need of tier.needs) {
          consumed += getPrice(cxPrices.value, need.material.ticker) * need.unitsPerInterval;
        }
      }
    }

    let isRecurring = false;

    if (production) {
      isRecurring = production.some(x => x.orders.some(y => y.recurring));

      for (const line of production) {
        let totalDuration = 0;
        for (const order of line.orders) {
          if (!order.started && (!isRecurring || order.recurring)) {
            totalDuration += order.duration.millis || Infinity;
          }
        }

        for (const order of line.orders) {
          if (!order.started && (!isRecurring || order.recurring)) {
            for (const mat of order.inputs) {
              const price = getPrice(cxPrices.value, mat.material.ticker);
              consumed += (price * mat.amount * 86400000 * line.capacity) / totalDuration;
            }

            for (const mat of order.outputs) {
              const price = getPrice(cxPrices.value, mat.material.ticker);
              produced += (price * mat.amount * 86400000 * line.capacity) / totalDuration;
            }
          }
        }
      }
    }

    const profit = produced - consumed;
    const margin = profit / consumed;
    entries.push({
      name: getPlanetNameFromAddress(site.address)!,
      produced,
      consumed,
      profit,
      margin,
    });
  }

  entries.sort((a, b) => b.profit - a.profit);
  return entries;
});

const totalProduced = computed(() => entries.value.map(x => x.produced).reduce((a, b) => a + b, 0));
const totalConsumed = computed(() => entries.value.map(x => x.consumed).reduce((a, b) => a + b, 0));
const totalProfit = computed(() => entries.value.map(x => x.profit).reduce((a, b) => a + b, 0));

const figures = computed(() => {
  return [
    { name: 'Daily Produced', value: formatAmount(totalProduced.value) },
    { name: 'Daily Consumed', value: formatAmount(totalConsumed.value) },
    { name: 'Daily Profit', value: formatAmount(totalProfit.value) },
  ];
});

function formatPercents(value: number) {
  return value.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 });
}

function profitClass(value: number) {
  return {
    [PrunCss.ColoredValue.positive]: value > 0,
    [PrunCss.ColoredValue.negative]: value < 0,
  };
}
</script>

<template>
  <FinHeader>Production Overview</FinHeader>
  <KeyFigures :figures="figures" />
  <FinHeader>Breakdown by Planet</FinHeader>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Produced</th>
        <th>Consumed</th>
        <th>Profit</th>
        <th>Margin</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in entries" :key="entry.name">
        <td>{{ entry.name }}</td>
        <td>{{ formatNumber(entry.produced) }}</td>
        <td>{{ formatNumber(entry.consumed) }}</td>
        <td>{{ formatNumber(entry.profit) }}</td>
        <td :class="profitClass(entry.margin)">{{ formatPercents(entry.margin) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table tr > *:not(:first-child) {
  text-align: right;
}
</style>
