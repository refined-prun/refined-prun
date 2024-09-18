<script setup lang="ts">
import PieChart from '@src/features/XIT/FIN/PieChart.vue';
import { liveBalanceSummary } from '@src/core/balance/balance-sheet-live';
</script>

<template>
  <PieChart
    :label-data="['Current', 'Non-Current', 'Locked']"
    :numerical-data="[
      liveBalanceSummary.currentAssets,
      liveBalanceSummary.nonCurrentAssets,
      liveBalanceSummary.lockedAssets,
    ]" />
</template>
