<script setup lang="ts">
import { deleteExchangeOrderFromClick } from '@src/infrastructure/prun-ui/utils/delete-exchange-order';
import PrunButton from '@src/components/PrunButton.vue';

const { orderId, screenCommand } = defineProps<{
  orderId: string;
  screenCommand: 'CXOS' | 'FXOS';
}>();

function onClick(event: MouseEvent) {
  deleteExchangeOrderFromClick(event, orderId, screenCommand);
}
</script>

<template>
  <PrunButton dark inline :class="$style.button" @click="onClick">del</PrunButton>
</template>

<style module>
.button {
  position: absolute;
  left: 2px;
}
</style>
