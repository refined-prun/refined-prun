<script setup lang="ts">
import PieChart from '@src/features/XIT/FIN/PieChart.vue';
import { liveBalanceSummary } from '@src/core/balance/balance-sheet-live';
</script>

<template>
  <PieChart
    :label-data="['Current', 'Non-Current', 'Locked']"
    :numerical-data="[
      liveBalanceSummary.currentAssets ?? 0,
      liveBalanceSummary.nonCurrentAssets ?? 0,
      liveBalanceSummary.lockedAssets ?? 0,
    ]" />
</template>
