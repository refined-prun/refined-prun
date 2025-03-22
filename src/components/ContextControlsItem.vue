<script setup lang="ts">
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import fa from '@src/utils/font-awesome.module.css';

const props = defineProps<{ cmd: string; label?: string; onClick?: (cmd: string) => void }>();

const commandParts = computed(() => {
  const words = props.cmd.split(' ');
  let command = words.shift();
  if (command === 'XIT') {
    command += ' ' + words.shift();
  }
  return [command, words.join(' ')];
});

const itemClasses = [C.ContextControls.item, C.fonts.fontRegular, C.type.typeSmall];
</script>

<template>
  <!-- The node structure is fully replicated from PrUn, don't mind unnecessary nodes. -->
  <div
    :class="itemClasses"
    @click="
      () => {
        onClick ? onClick(cmd) : showBuffer(cmd);
      }
    ">
    <span>
      <span :class="[C.ContextControls.cmd, fa.solid]">{{ commandParts[0] }}</span>
      {{ commandParts[1] }}
    </span>
    <span v-if="label" :class="C.ContextControls.label">: {{ label }}</span>
  </div>
</template>
