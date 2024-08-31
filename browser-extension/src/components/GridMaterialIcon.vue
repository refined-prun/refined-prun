<script setup lang="ts">
import GridItemView from '@src/components/GridItemView.vue';
import MaterialIcon from '@src/components/MaterialIcon.vue';
import { getMaterialNameByTicker } from '@src/infrastructure/prun-ui/material-names';
import { computed } from 'vue';

const props = defineProps({
  ticker: {
    type: String,
    required: true,
  },
  small: Boolean,
  amount: {
    type: Number,
    required: false,
    default: undefined,
  },
  text: {
    type: String,
    required: false,
    default: undefined,
  },
});

const name = computed(() => {
  if (!props.text) {
    return undefined;
  }
  if (props.ticker === 'SHPT') {
    return 'Shipment';
  }
  return getMaterialNameByTicker(props.ticker) ?? '???';
});
</script>

<template>
  <GridItemView :name="name">
    <MaterialIcon :small="small" :ticker="ticker" :amount="amount" />
  </GridItemView>
</template>
