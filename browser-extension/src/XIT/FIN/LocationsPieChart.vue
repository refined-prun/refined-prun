<script setup lang="ts">
import PieChart from '@src/XIT/FIN/PieChart.vue';
import { computed } from 'vue';
import { calculateFinancials } from '@src/core/financials';

const snapshot = computed(() => calculateFinancials());
</script>

<template>
  <PieChart
    :label-data="snapshot.locations.map(x => x.name)"
    :numerical-data="snapshot.locations.map(x => x.total)" />
</template>
