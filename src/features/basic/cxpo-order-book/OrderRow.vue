<script setup lang="ts">
import highlight from '@src/infrastructure/prun-ui/table-row-highlight.module.css';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { fixed0, fixed2 } from '@src/utils/format';
import PrunButton from '@src/components/PrunButton.vue';

const { order, request, setinputs } = defineProps<{
  order: PrunApi.CXBrokerOrder;
  request?: boolean;
  setinputs: (quantity: string | undefined, priceLimit: string | undefined) => void;
}>();

const ownOrderClass = computed(() => ({
  [highlight.highlight]: order.amount && order.trader.id === companyStore.value?.id,
}));
const amount = computed(() => (order.amount ? fixed0(order.amount) : '∞'));
const price = computed(() => fixed2(order.limit.amount));
const priceClass = computed(() =>
  request ? C.ComExOrderBookPanel.requestPrice : C.ComExOrderBookPanel.offerPrice,
);
</script>

<template>
  <tr :class="ownOrderClass">
    <td :class="C.ComExOrderBookPanel.amount"
      ><div :class="$style.tdDiv"
        ><PrunButton dark inline @click="setinputs(amount, price)">Both</PrunButton>
        {{ amount }}</div
      ></td
    >
    <td :class="[priceClass, $style.price]"
      ><div :class="$style.tdDiv"
        >{{ price }}
        <PrunButton dark inline @click="setinputs(undefined, price)">Set</PrunButton></div
      ></td
    >
  </tr>
</template>

<style module>
/*
  Override left/right padding from vanilla class
*/
table tbody td.price {
  padding: 2px;
}

.tdDiv {
  justify-content: space-between;
  display: flex;
}
</style>
