<script setup lang="ts">
import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import OrderRow from './OrderRow.vue';
import { fixed2 } from '@src/utils/format';
import { isEmpty } from 'ts-extras';
import { OrderHoverData } from '@src/features/basic/cxpo-order-book/order-hover-data';
import { isFiniteOrder } from '@src/core/orders';

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

const scrollElement = useTemplateRef<HTMLElement>('order-book');
const spreadElement = useTemplateRef<HTMLElement>('spread');
watchEffect(() => {
  if (!scrollElement.value || !spreadElement.value) {
    return;
  }

  const spreadRect = spreadElement.value.getBoundingClientRect();
  scrollElement.value.scrollTop = Math.max(
    spreadElement.value.offsetTop - scrollElement.value.clientHeight / 2 + spreadRect.height / 2,
    0,
  );
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
  const orders = getCumulativeOrders(order);
  const quantity = orders.map(x => x.amount as number).reduce((a, b) => a + b, 0);
  onOrderClick(orders.at(-1)?.limit.amount ?? 0, quantity);
}

const cumulativeOrders = computed(() => {
  if (!hoverData.value || !hoverData.value.cumulative) {
    return [];
  }

  return getCumulativeOrders(hoverData.value.order);
});

const highlightedAmounts = computed(() => new Set(cumulativeOrders.value));

function isAmountHighlighted(order: PrunApi.CXBrokerOrder) {
  return highlightedAmounts.value.has(order);
}

const highlightedPrice = computed(() => {
  if (!hoverData.value) {
    return undefined;
  }
  if (!hoverData.value.cumulative) {
    return hoverData.value.order;
  }
  return cumulativeOrders.value.at(-1);
});

function isPriceHighlighted(order: PrunApi.CXBrokerOrder) {
  return highlightedPrice.value?.id === order.id;
}

function getCumulativeOrders(targetOrder: PrunApi.CXBrokerOrder) {
  if (!orderBook.value) {
    return [];
  }

  const orders = orderBook.value.sellingOrders.includes(targetOrder)
    ? orderBook.value.sellingOrders
    : orderBook.value.buyingOrders;
  let cumulativeOrders = [] as PrunApi.CXBrokerOrder[];
  for (const order of orders) {
    cumulativeOrders.push(order);
    if (order.id === targetOrder.id || !isFiniteOrder(order)) {
      break;
    }
  }
  return cumulativeOrders;
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
      <tbody>
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
      <tbody ref="spread">
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
  width: 160px;
  overflow-y: scroll;
  scrollbar-width: none;
}

.spread {
  text-align: center;
}
</style>
