<script setup lang="ts">
import highlight from '@src/infrastructure/prun-ui/table-row-highlight.module.css';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { fixed0, fixed2 } from '@src/utils/format';

const props = defineProps({
  order: {
    type: Object as PropType<PrunApi.CXBrokerOrder>,
    required: true,
  },
  request: Boolean,
});

const ownOrderClass = computed(() => ({
  [highlight.highlight]: props.order.amount && props.order.trader.id === companyStore.value?.id,
}));
const amount = computed(() => (props.order.amount ? fixed0(props.order.amount) : '∞'));
const price = computed(() => fixed2(props.order.limit.amount));
const priceClass = computed(() =>
  props.request ? C.ComExOrderBookPanel.requestPrice : C.ComExOrderBookPanel.offerPrice,
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
table tbody td.price {
  padding: 2px;
}
</style>
