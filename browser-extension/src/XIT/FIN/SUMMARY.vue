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

interface InventoryEntry {
  name: string;
  fixed: number;
  current: number;
  total: number;
}

const entries = computed<InventoryEntry[]>(() => {
  const buildings = finResult.value.Buildings;
  const inventory = finResult.value.Inventory;
  const locations = new Set<string>([...buildings.map(x => x[0]), ...inventory.map(x => x[0])]);
  const entries: InventoryEntry[] = [];
  for (const name of locations) {
    const fixed = buildings.find(x => x[0] === name)?.[1] ?? 0;
    const current = inventory.find(x => x[0] === name)?.[1] ?? 0;
    const total = fixed + current;
    entries.push({
      name,
      fixed,
      current,
      total,
    });
  }

  entries.sort((a, b) => b.total - a.total);
  return entries;
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
        <tr v-for="entry in entries" :key="entry.name">
          <td>{{ entry.name }}</td>
          <td>{{ formatNumber(entry.fixed) }}</td>
          <td>{{ formatNumber(entry.current) }}</td>
          <td>{{ formatNumber(entry.total) }}</td>
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
