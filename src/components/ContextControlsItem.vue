<script setup lang="ts">
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

const props = defineProps<{ cmd: string; label?: string }>();

const lastSpaceIndex = props.cmd.lastIndexOf(' ');
const command = props.cmd.substring(0, lastSpaceIndex);
const argument = props.cmd.substring(lastSpaceIndex + 1);

const itemClasses = [C.ContextControls.item, C.fonts.fontRegular, C.type.typeSmall];
</script>

<template>
  <!-- The node structure is fully replicated from PrUn, don't mind unnecessary nodes. -->
  <div :class="itemClasses" @click="() => showBuffer(cmd)">
    <span>
      <span :class="C.ContextControls.cmd">{{ command }}</span>
      {{ argument }}
    </span>
    <span v-if="label" :class="C.ContextControls.label">: {{ label }}</span>
  </div>
</template>
