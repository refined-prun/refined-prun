<script setup lang="ts">
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

const props = defineProps<{ cmd: string; label?: string }>();

const commandAndArg = computed(() => {
  const words = props.cmd.split(' ');
  return words[0] === 'XIT'
    ? [words[0] + ' ' + words[1], words.slice(2).join(' ') ?? '']
    : [words[0], words.slice(1).join(' ') ?? ''];
});

const itemClasses = [C.ContextControls.item, C.fonts.fontRegular, C.type.typeSmall];
</script>

<template>
  <!-- The node structure is fully replicated from PrUn, don't mind unnecessary nodes. -->
  <div :class="itemClasses" @click="() => showBuffer(cmd)">
    <span>
      <span :class="C.ContextControls.cmd">{{ commandAndArg[0] }}</span>
      {{ commandAndArg[1] }}
    </span>
    <span v-if="label" :class="C.ContextControls.label">: {{ label }}</span>
  </div>
</template>
