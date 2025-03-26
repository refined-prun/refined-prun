<script setup lang="ts">
import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import OrderRow from './OrderRow.vue';
import { fixed2 } from '@src/utils/format';
import { isEmpty } from 'ts-extras';

const { ticker, setinputs } = defineProps<{
  ticker?: string;
  setinputs: (quantity: string | undefined, priceLimit: string | undefined) => void;
}>();

const orderInfo = computed(() => cxobStore.getByTicker(ticker));

const offers = computed(() => (orderInfo.value?.sellingOrders ?? []).slice().reverse());
const requests = computed(() => orderInfo.value?.buyingOrders ?? []);
const spread = computed(() => {
  const ask = orderInfo.value?.ask?.price.amount;
  const bid = orderInfo.value?.bid?.price.amount;
  return ask && bid ? fixed2(ask - bid) : '--';
});

const orderBook = useTemplateRef<HTMLDivElement>('order-book');
const offerBody = useTemplateRef<HTMLTableSectionElement>('offer-body');
watchEffect(() => {
  if (!orderBook.value || !offerBody.value) {
    return;
  }

  orderBook.value.scrollTop = Math.max(offerBody.value.offsetHeight - 90, 0);
});

// Market maker index to prevent 'fill' button on Infinity orders, and 'set' button on anything past MM.
const offerInfiniteIndex = computed(() => offers.value.findIndex(offer => !offer.amount));
const requestInfiniteIndex = computed(() => {
  const index = requests.value.findIndex(offer => !offer.amount);
  return index === -1 ? Infinity : index;
});

function click(type: string, info: string | PrunApi.CXBrokerOrder) {
  if (type === 'fill') {
    const order = info as PrunApi.CXBrokerOrder;
    const orders = offers.value.includes(order) ? offers.value.toReversed() : requests.value;
    let quantity = 0;
    let priceLimit = 0;
    for (const offer of orders) {
      quantity += offer.amount!;
      priceLimit = offer.limit.amount;
      if (offer.id === order.id) {
        setinputs(quantity.toString(), priceLimit.toString());
        return;
      }
    }
    return undefined;
  } else if (type === 'price') {
    setinputs(undefined, info as string);
  }
  return undefined;
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
        <tr>
          <th colSpan="2">Offers</th>
        </tr>
        <template v-if="!isEmpty(offers)">
          <OrderRow
            v-for="(order, index) in offers"
            :key="order.id"
            :order="order"
            :infinite="index <= offerInfiniteIndex"
            :infinite1="index <= offerInfiniteIndex - 1"
            :click="click" />
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
        <tr>
          <th colSpan="2">Requests</th>
        </tr>
        <template v-if="!isEmpty(requests)">
          <OrderRow
            v-for="(order, index) in requests"
            :key="order.id"
            request
            :order="order"
            :infinite="index >= requestInfiniteIndex"
            :infinite1="index >= requestInfiniteIndex + 1"
            :click="click" />
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
  flex: 1;
  width: 120px;
  height: 248px;
  vertical-align: top;
  scrollbar-width: none;
}

.spread {
  text-align: center;
}
</style>
