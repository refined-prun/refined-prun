<script setup lang="ts">
import highlight from '@src/infrastructure/prun-ui/table-row-highlight.module.css';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { fixed0, fixed2 } from '@src/utils/format';
import PrunButton from '@src/components/PrunButton.vue';

const $style = useCssModule();

const { order, request, infiniteFill, infiniteSet, click } = defineProps<{
  order: PrunApi.CXBrokerOrder;
  request?: boolean;
  infiniteFill: boolean;
  infiniteSet: boolean;
  click: (quantity: string, info: string | PrunApi.CXBrokerOrder) => void;
}>();

const ownOrderClass = computed(() => ({
  [highlight.highlight]: (order.amount ?? 0) > 0 && order.trader.id === companyStore.value?.id,
}));
const amount = computed(() => ((order.amount ?? 0) > 0 ? fixed0(order.amount!) : '∞'));
const price = computed(() => fixed2(order.limit.amount));
const priceClass = computed(() =>
  request ? C.ComExOrderBookPanel.requestPrice : C.ComExOrderBookPanel.offerPrice,
);
const fillButtonClass = computed(() => (infiniteFill ? $style.tdDiv : ''));
const setButtonClass = computed(() => (infiniteSet ? $style.tdDiv : ''));
</script>

<template>
  <tr :class="ownOrderClass">
    <td :class="C.ComExOrderBookPanel.amount"
      ><div :class="fillButtonClass"
        ><PrunButton v-if="!infiniteFill" dark inline @click="click('fill', order)"
          >fill</PrunButton
        >
        {{ amount }}</div
      ></td
    >
    <td :class="[priceClass, $style.price]"
      ><div :class="setButtonClass"
        >{{ price }}
        <PrunButton v-if="!infiniteSet" dark inline @click="click('price', price)"
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
