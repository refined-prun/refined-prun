<script setup lang="ts">
import PieChart from '@src/XIT/FIN/PieChart.vue';
import { currentAssets } from '@src/core/balance/current-assets';
import { nonCurrentAssets } from '@src/core/balance/non-current-assets';
</script>

<template>
  <PieChart
    :label-data="['Current', 'Non-Current']"
    :numerical-data="[currentAssets.total.value, nonCurrentAssets.total.value]" />
</template>
