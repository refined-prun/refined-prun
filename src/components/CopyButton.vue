<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import { useClipboard } from '@src/hooks/use-clipboard';

const { copyFn } = defineProps<{
  copyFn: () => string;
}>();

const { copied, copy } = useClipboard();

async function onClick() {
  await copy(copyFn());
}
</script>

<template>
  <PrunButton
    primary
    data-tooltip-position="top"
    :data-tooltip="copied ? 'Copied!' : undefined"
    @click="onClick">
    COPY
  </PrunButton>
</template>
