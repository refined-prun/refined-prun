<script setup lang="ts">
import PieChart from '@src/XIT/FIN/PieChart.vue';
import { computed } from 'vue';
import { calculateFinancials } from '@src/core/financials';

const snapshot = computed(() => calculateFinancials());
</script>

<template>
  <PieChart
    :label-data="['Fixed', 'Current', 'Liquid']"
    :numerical-data="[snapshot.Totals.Fixed, snapshot.Totals.Current, snapshot.Totals.Liquid]" />
</template>
