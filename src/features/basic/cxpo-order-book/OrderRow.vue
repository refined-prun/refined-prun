<script setup lang="ts">
import highlight from '@src/infrastructure/prun-ui/table-row-highlight.module.css';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { fixed0, fixed2 } from '@src/utils/format';
import PrunButton from '@src/components/PrunButton.vue';

const { order, request, click } = defineProps<{
  order: PrunApi.CXBrokerOrder;
  request?: boolean;
  infinite: boolean;
  infinite1: boolean;
  click: (quantity: string, info: string | PrunApi.CXBrokerOrder) => void;
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
      ><div :class="!infinite ? $style.tdDiv : ''"
        ><PrunButton v-if="!infinite" dark inline @click="click('fill', order)">fill</PrunButton>
        {{ amount }}</div
      ></td
    >
    <td :class="[priceClass, $style.price]"
      ><div :class="!infinite1 ? $style.tdDiv : ''"
        >{{ price }}
        <PrunButton v-if="!infinite1" dark inline @click="click('price', price)"
          >set</PrunButton
        ></div
      ></td
    >
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

.tdDiv {
  justify-content: space-between;
  display: flex;
}
</style>
