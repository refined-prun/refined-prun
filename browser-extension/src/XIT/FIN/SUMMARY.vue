<script setup lang="ts">
import { computed } from 'vue';
import { calculateFinancials } from '@src/financials';
import KeyFigures from '@src/XIT/FIN/KeyFigures.vue';
import FinHeader from '@src/XIT/FIN/FinHeader.vue';
import { formatAmount, formatNumber } from '@src/XIT/FIN/utils';

const finResult = computed(() => calculateFinancials());
const equity = computed(() => {
  const totals = finResult.value.Totals;
  return totals.Fixed + totals.Current + totals.Liquid - totals.Liabilities;
});

const figures = computed(() => {
  const totals = finResult.value.Totals;
  return [
    { name: 'Fixed Assets', value: formatAmount(totals.Fixed) },
    { name: 'Current Assets', value: formatAmount(totals.Current) },
    { name: 'Liquid Assets', value: formatAmount(totals.Liquid) },
    { name: 'Equity', value: formatAmount(equity.value) },
    { name: 'Liabilities', value: formatAmount(totals.Liabilities) },
  ];
});
</script>

<template>
  <div>
    <FinHeader>Key Figures</FinHeader>
    <KeyFigures :figures="figures" />
    <FinHeader>Inventory Breakdown</FinHeader>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Fixed Assets</th>
          <th>Current Assets</th>
          <th>Total Assets</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="location in finResult.locations" :key="location.name">
          <td>{{ location.name }}</td>
          <td>{{ formatNumber(location.fixed) }}</td>
          <td>{{ formatNumber(location.current) }}</td>
          <td>{{ formatNumber(location.total) }}</td>
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
