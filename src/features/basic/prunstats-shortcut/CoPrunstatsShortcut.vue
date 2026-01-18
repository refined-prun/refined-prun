<script setup lang="ts">
import { showBuffer } from '@src/infrastructure/prun-ui/buffers.ts';

defineProps<{ username: string }>();
</script>

<template>
  <div>
    <button
      :class="`${C.Button.neutralInline} ${C.Button.neutral} ${C.Button.btn} ${C.Button.inline}`"
      @click="
        () =>
          showBuffer(
            `XIT PRUNSTATS_type-compTotals_chartType-treemap_metric-volume_companyName-${username}_hideOptions`,
          )
      ">
      Products
    </button>
    <button
      :class="`${C.Button.neutralInline} ${C.Button.neutral} ${C.Button.btn} ${C.Button.inline}`"
      @click="
        () =>
          showBuffer(
            `XIT PRUNSTATS_type-compHistory_metric-volume_companyName-${username}_hideOptions`,
          )
      ">
      History
    </button>
  </div>
</template>

<style module></style>
