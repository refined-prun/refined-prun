<script setup lang="ts">
import GridItemView from '@src/components/GridItemView.vue';
import MaterialIcon from '@src/components/MaterialIcon.vue';
import { getMaterialNameByTicker } from '@src/util';

const { text, ticker } = defineProps<{
  amount?: number;
  text?: string;
  ticker: string;
  warning?: boolean;
}>();

const name = computed(() => {
  if (text !== undefined) {
    return text;
  }
  if (ticker === 'SHPT') {
    return 'Shipment';
  }
  return getMaterialNameByTicker(ticker) ?? '???';
});
</script>

<template>
  <GridItemView :name="name">
    <MaterialIcon :ticker="ticker" :amount="amount" :warning="warning" />
  </GridItemView>
</template>
