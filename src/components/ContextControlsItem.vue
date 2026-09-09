<script setup lang="ts">
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

const { cmd, cmdText, label } = defineProps<{ cmd: string; cmdText?: string; label?: string }>();

const commandParts = computed(() => {
  const words = (cmdText ?? cmd).split(' ');
  let command = words.shift();
  if (command === 'XIT') {
    command += ' ' + words.shift();
  }
  return [command, words.join(' ')];
});
</script>

<template>
  <!-- The node structure is fully replicated from PrUn, don't mind unnecessary nodes. -->
  <div
    :class="[C.ContextControls.item, C.fonts.fontRegular, C.type.typeSmall]"
    @click="() => showBuffer(cmd)">
    <span>
      <span :class="C.ContextControls.cmd">{{ commandParts[0] }}</span>
      {{ commandParts[1] }}
    </span>
    <span v-if="label" :class="C.ContextControls.label">: {{ label }}</span>
  </div>
</template>
