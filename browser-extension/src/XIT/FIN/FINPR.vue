<script setup lang="ts">
import { getPlanetNameFromAddress } from '@src/prun-api/data/addresses';
import { sitesStore } from '@src/prun-api/data/sites';
import FinHeader from '@src/XIT/FIN/FinHeader.vue';
import { computed } from 'vue';
import { formatAmount } from '@src/XIT/FIN/utils';
import KeyFigures from '@src/XIT/FIN/KeyFigures.vue';
import { cxStore } from '@src/fio/cx';
import PrunCss from '@src/prun-ui/prun-css';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { calculateSiteProfitability } from '@src/core/profitability';
import { sumBy } from '@src/utils/sum-by';
import { fixed0, percent2 } from '@src/utils/format';

interface ProductionEntry {
  name: string;
  produced: number;
  consumed: number;
  profit: number;
  margin: number;
}

const entries = computed<ProductionEntry[]>(() => {
  const entries: ProductionEntry[] = [];
  for (const site of sitesStore.all.value) {
    const profitability = calculateSiteProfitability(site.siteId);
    entries.push({
      name: getPlanetNameFromAddress(site.address)!,
      produced: profitability.produced,
      consumed: profitability.consumed,
      profit: profitability.profit,
      margin: profitability.margin,
    });
  }

  entries.sort((a, b) => b.profit - a.profit);
  return entries;
});

const totalProduced = computed(() => sumBy(entries, x => x.produced));
const totalConsumed = computed(() => sumBy(entries, x => x.consumed));
const totalProfit = computed(() => sumBy(entries, x => x.profit));

const figures = computed(() => {
  return [
    { name: 'Daily Produced', value: formatAmount(totalProduced.value) },
    { name: 'Daily Consumed', value: formatAmount(totalConsumed.value) },
    { name: 'Daily Profit', value: formatAmount(totalProfit.value) },
  ];
});

function profitClass(value: number) {
  return {
    [PrunCss.ColoredValue.positive]: value > 0,
    [PrunCss.ColoredValue.negative]: value < 0,
  };
}
</script>

<template>
  <LoadingSpinner v-if="!cxStore.fetched" />
  <div v-else>
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
          <td>{{ fixed0(entry.produced) }}</td>
          <td>{{ fixed0(entry.consumed) }}</td>
          <td>{{ fixed0(entry.profit) }}</td>
          <td :class="profitClass(entry.margin)">{{ percent2(entry.margin) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table tr > *:not(:first-child) {
  text-align: right;
}
</style>
