<script setup lang="ts">
import { computed } from 'vue';
import { calculateFinancials } from '@src/financials';
import KeyFigures from '@src/XIT/FIN/KeyFigures.vue';
import FinHeader from '@src/XIT/FIN/FinHeader.vue';
import { formatAmount } from '@src/XIT/FIN/utils';

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
  </div>
</template>
