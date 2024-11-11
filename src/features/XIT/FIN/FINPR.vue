<script setup lang="ts">
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import FinHeader from '@src/features/XIT/FIN/FinHeader.vue';
import { computed } from 'vue';
import { formatCurrencyAmount } from '@src/features/XIT/FIN/utils';
import KeyFigures from '@src/features/XIT/FIN/KeyFigures.vue';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { calculateSiteProfitability } from '@src/core/profitability';
import { sumBy } from '@src/utils/sum-by';
import { fixed0, percent2 } from '@src/utils/format';
import { map } from '@src/utils/map-values';
import { isDefined } from 'ts-extras';

const entries = computed(() => {
  return (
    sitesStore.all.value
      ?.map(x => calculateSiteProfitability(x))
      .filter(isDefined)
      .sort((a, b) => b.profit - a.profit) ?? []
  );
});

const dailyCost = computed(() => sumBy(entries.value, x => x.cost));
const dailyRepairs = computed(() => sumBy(entries.value, x => x.repairs));
const dailyRevenue = computed(() => sumBy(entries.value, x => x.revenue));
const dailyProfit = computed(() => sumBy(entries.value, x => x.profit));
const dailyMargin = computed(() => {
  return map([dailyRevenue.value, dailyProfit.value], (revenue, profit) =>
    revenue !== 0 ? profit / revenue : 0,
  );
});

const figures = computed(() => {
  return [
    { name: 'Daily Cost', value: formatCurrencyAmount(dailyCost.value) },
    { name: 'Daily Repairs', value: formatCurrencyAmount(dailyRepairs.value) },
    { name: 'Daily Revenue', value: formatCurrencyAmount(dailyRevenue.value) },
    { name: 'Daily Profit', value: formatCurrencyAmount(dailyProfit.value) },
    {
      name: 'Daily Margin',
      value: dailyMargin.value !== undefined ? percent2(dailyMargin.value) : '--',
    },
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
  <div>
    <FinHeader>Production Overview</FinHeader>
    <KeyFigures :figures="figures" />
    <FinHeader>Breakdown by Planet</FinHeader>
    <table>
      <colgroup span="6" style="width: calc(100% / 6)"></colgroup>
      <thead>
        <tr>
          <th>Name</th>
          <th>Cost</th>
          <th>Repairs</th>
          <th>Revenue</th>
          <th>Profit</th>
          <th>Margin</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in entries" :key="entry.name">
          <td>{{ entry.name }}</td>
          <td>{{ fixed0(entry.cost) }}</td>
          <td>{{ fixed0(entry.repairs) }}</td>
          <td>{{ fixed0(entry.revenue) }}</td>
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
