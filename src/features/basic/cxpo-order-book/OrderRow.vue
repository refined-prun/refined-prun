<script setup lang="ts">
import highlight from '@src/infrastructure/prun-ui/table-row-highlight.module.css';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { fixed0, fixed2 } from '@src/utils/format';

const { order, request } = defineProps<{ order: PrunApi.CXBrokerOrder; request?: boolean }>();

const ownOrderClass = computed(() => ({
  [highlight.highlight]: (order.amount ?? 0) > 0 && order.trader.id === companyStore.value?.id,
}));
const amount = computed(() => ((order.amount ?? 0) > 0 ? fixed0(order.amount!) : '∞'));
const price = computed(() => fixed2(order.limit.amount));
const priceClass = computed(() =>
  request ? C.ComExOrderBookPanel.requestPrice : C.ComExOrderBookPanel.offerPrice,
);
</script>

<template>
  <tr :class="ownOrderClass">
    <td :class="C.ComExOrderBookPanel.amount">{{ amount }}</td>
    <td :class="[priceClass, $style.price]">{{ price }}</td>
  </tr>
</template>

<style module>
/*
  Override left/right padding from vanilla class
*/
.price {
  table tbody td& {
    padding: 2px;
  }
}
</style>
