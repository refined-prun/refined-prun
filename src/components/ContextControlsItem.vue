<script setup lang="ts">
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

defineProps({
  cmd: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: undefined,
  },
});

const itemClasses = [
  PrunCss.ContextControls.item,
  PrunCss.fonts.fontRegular,
  PrunCss.type.typeSmall,
];
</script>

<template>
  <!-- The node structure is fully replicated from PrUn, don't mind unnecessary nodes. -->
  <div :class="itemClasses" @click="() => showBuffer(cmd)">
    <span>
      <span :class="PrunCss.ContextControls.cmd">{{ cmd }}</span>
    </span>
    <span v-if="label" :class="PrunCss.ContextControls.label">: {{ label }}</span>
  </div>
</template>
