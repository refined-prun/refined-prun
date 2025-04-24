<script setup lang="ts">
import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import OrderRow from './OrderRow.vue';
import { fixed2 } from '@src/utils/format';
import { isEmpty } from 'ts-extras';
import { OrderHoverData } from '@src/features/basic/cxpo-order-book/order-hover-data';

const { ticker, onOrderClick } = defineProps<{
  ticker?: string;
  onOrderClick: (price: number, quantity?: number) => void;
}>();

const orderBook = computed(() => cxobStore.getByTicker(ticker));

const offers = computed(() => orderBook.value?.sellingOrders.toReversed() ?? []);
const requests = computed(() => orderBook.value?.buyingOrders ?? []);
const spread = computed(() => {
  const ask = orderBook.value?.ask?.price.amount;
  const bid = orderBook.value?.bid?.price.amount;
  return ask !== undefined && bid !== undefined ? fixed2(ask - bid) : '--';
});

const orderBookContainer = useTemplateRef<HTMLDivElement>('order-book');
const offerBody = useTemplateRef<HTMLTableSectionElement>('offer-body');
watchEffect(() => {
  if (!orderBookContainer.value || !offerBody.value) {
    return;
  }

  orderBookContainer.value.scrollTop = Math.max(offerBody.value.offsetHeight - 90, 0);
});

const hoverData = shallowRef<OrderHoverData | null>(null);

function onHover(data: OrderHoverData | null) {
  hoverData.value = data;
}

function onClick(data: OrderHoverData) {
  if (!orderBook.value) {
    return;
  }

  const order = data.order;
  if (!data.cumulative) {
    onOrderClick(order.limit.amount);
    return;
  }
  const orders = orderBook.value.sellingOrders.includes(order)
    ? orderBook.value.sellingOrders
    : orderBook.value.buyingOrders;
  let quantity = 0;
  for (const bookOrder of orders) {
    // MM orders don't have the amount.
    if (bookOrder.amount === null) {
      break;
    }
    quantity += bookOrder.amount;
    if (bookOrder.id === order.id) {
      break;
    }
  }
  onOrderClick(order.limit.amount, quantity);
}

const highlightedAmounts = computed(() => {
  if (!orderBook.value || !hoverData.value || !hoverData.value.cumulative) {
    return new Set();
  }
  const order = hoverData.value.order;
  const orders = orderBook.value.sellingOrders.includes(order)
    ? orderBook.value.sellingOrders
    : orderBook.value.buyingOrders;
  const index = orders.indexOf(order);
  return new Set(orders.slice(0, index + 1));
});

function isAmountHighlighted(order: PrunApi.CXBrokerOrder) {
  return highlightedAmounts.value.has(order);
}

function isPriceHighlighted(order: PrunApi.CXBrokerOrder) {
  return hoverData.value?.order.id === order.id;
}
</script>

<template>
  <div ref="order-book" :class="$style.container">
    <table>
      <thead>
        <tr>
          <th>Amt.</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody ref="offer-body">
        <template v-if="!isEmpty(offers)">
          <OrderRow
            v-for="order in offers"
            :key="order.id"
            :order="order"
            :highlight-amount="isAmountHighlighted(order)"
            :highlight-price="isPriceHighlighted(order)"
            :on-hover="onHover"
            :on-click="onClick" />
        </template>
        <tr v-else>
          <td :class="C.ComExOrderBookPanel.empty" colSpan="2">No offers.</td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td colSpan="2" :class="[C.ComExOrderBookPanel.spread, $style.spread]">
            Spread: <span :style="{ color: '#eee' }">{{ spread }}</span>
          </td>
        </tr>
      </tbody>
      <tbody>
        <template v-if="!isEmpty(requests)">
          <OrderRow
            v-for="order in requests"
            :key="order.id"
            request
            :order="order"
            :highlight-amount="isAmountHighlighted(order)"
            :highlight-price="isPriceHighlighted(order)"
            :on-hover="onHover"
            :on-click="onClick" />
        </template>
        <tr v-else>
          <td :class="C.ComExOrderBookPanel.empty" colSpan="2">No requests.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style module>
.container {
  overflow-y: scroll;
  width: 160px;
  height: 248px;
  vertical-align: top;
  scrollbar-width: none;
}

.spread {
  text-align: center;
}
</style>
