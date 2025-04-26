<script setup lang="ts">
import link from '@src/infrastructure/prun-ui/css/link.module.css';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { fixed0, fixed2 } from '@src/utils/format';
import { OrderHoverData } from '@src/features/basic/cxpo-order-book/order-hover-data';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

const { order, request, highlightAmount, highlightPrice, onHover, onClick } = defineProps<{
  order: PrunApi.CXBrokerOrder;
  request?: boolean;
  highlightAmount: boolean;
  highlightPrice: boolean;
  onHover: (data: OrderHoverData | null) => void;
  onClick: (data: OrderHoverData) => void;
}>();

const $style = useCssModule();

const isOwnOrder = computed(
  () => (order.amount ?? 0) > 0 && order.trader.id === companyStore.value?.id,
);
const amount = computed(() => ((order.amount ?? 0) > 0 ? fixed0(order.amount!) : '∞'));
const amountClass = computed(() => ({
  [$style.value]: true,
  [$style.valueHighlight]: highlightAmount,
  [link.link]: isOwnOrder.value,
}));
const price = computed(() => fixed2(order.limit.amount));
const priceClass = computed(() => [
  request ? C.ComExOrderBookPanel.requestPrice : C.ComExOrderBookPanel.offerPrice,
  {
    [$style.valueHighlight]: highlightPrice,
  },
]);

function onValueMouseEnter(cumulative: boolean) {
  if (isOwnOrder.value && cumulative) {
    return;
  }
  onHover({ order, cumulative });
}

function onValueMouseLeave() {
  onHover(null);
}

function onValueClick(cumulative: boolean) {
  if (isOwnOrder.value && cumulative) {
    showBuffer(`CXO ${order.id.substring(0, 8)}`);
    return;
  }
  onClick({ order, cumulative });
}
</script>

<template>
  <tr>
    <td
      :class="[C.ComExOrderBookPanel.amount, amountClass]"
      @mouseenter="onValueMouseEnter(true)"
      @mouseleave="onValueMouseLeave"
      @click="onValueClick(true)">
      <div>
        {{ amount }}
      </div>
    </td>
    <td
      :class="[priceClass, $style.value, $style.price]"
      @mouseenter="onValueMouseEnter(false)"
      @mouseleave="onValueMouseLeave"
      @click="onValueClick(false)">
      <div>
        {{ price }}
      </div>
    </td>
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

.value {
  cursor: pointer;
}

.valueHighlight {
  color: #f7a600;
}
</style>
