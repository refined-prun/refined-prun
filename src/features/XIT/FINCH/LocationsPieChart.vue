<script setup lang="ts">
import PieChart from '@src/features/XIT/FINCH/PieChart.vue';
import { calculateLocationAssets } from '@src/core/financials';

const locations = computed(() => calculateLocationAssets() ?? []);
</script>

<template>
  <PieChart
    :label-data="locations.map(x => x.name)"
    :numerical-data="locations.map(x => x.total)" />
</template>
