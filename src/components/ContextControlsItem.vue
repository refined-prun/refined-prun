<script setup lang="ts">
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

defineProps<{ cmd: string; label?: string }>();

const itemClasses = [C.ContextControls.item, C.fonts.fontRegular, C.type.typeSmall];
</script>

<template>
  <!-- The node structure is fully replicated from PrUn, don't mind unnecessary nodes. -->
  <div :class="itemClasses" @click="() => showBuffer(cmd)">
    <span>
      <span :class="C.ContextControls.cmd">{{ cmd }}</span>
    </span>
    <span v-if="label" :class="C.ContextControls.label">: {{ label }}</span>
  </div>
</template>
