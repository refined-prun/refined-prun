<script setup lang="ts">
import GridItemView from '@src/components/GridItemView.vue';
import MaterialIcon from '@src/components/MaterialIcon.vue';
import { computed } from 'vue';
import { getMaterialNameByTicker } from '@src/util';

const props = defineProps({
  ticker: {
    type: String,
    required: true,
  },
  warning: Boolean,
  amount: {
    type: Number,
    default: undefined,
  },
  text: {
    type: String,
    default: undefined,
  },
});

const name = computed(() => {
  if (props.text !== undefined) {
    return props.text;
  }
  if (props.ticker === 'SHPT') {
    return 'Shipment';
  }
  return getMaterialNameByTicker(props.ticker) ?? '???';
});
</script>

<template>
  <GridItemView :name="name">
    <MaterialIcon :ticker="ticker" :amount="amount" :warning="warning" />
  </GridItemView>
</template>
