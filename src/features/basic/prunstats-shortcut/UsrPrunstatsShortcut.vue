<script setup lang="ts">
import { showBuffer } from '@src/infrastructure/prun-ui/buffers.ts';

defineProps<{ username: string }>();
</script>

// I'm not sure what the C.ContextControls.label element is for
<template>
  <div
    :class="`${C.ContextControls.item} ${C.fonts.fontRegular} ${C.type.typeSmall}`"
    @click="
      () =>
        showBuffer(
          `XIT PRUNSTATS_type-compTotals_chartType-treemap_metric-volume_companyName-${username}_hideOptions`,
        )
    ">
    <span>
      <span :class="C.ContextControls.cmd">PRUNSTATS</span>
      Products
    </span>

    <span :class="C.ContextControls.label">: Production statistics</span>
  </div>
  <div
    :class="`${C.ContextControls.item} ${C.fonts.fontRegular} ${C.type.typeSmall}`"
    @click="
      () =>
        showBuffer(
          `XIT PRUNSTATS_type-compHistory_metric-volume_companyName-${username}_hideOptions`,
        )
    ">
    <span>
      <span :class="C.ContextControls.cmd">PRUNSTATS</span>
      History
    </span>
    <span :class="C.ContextControls.label">: Revenue history</span>
  </div>
</template>

<style module></style>
