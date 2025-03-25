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
          <OrderRow v-for="order in offers" :key="order.id" :order="order" :setinputs="setinputs" />
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
            v-for="order in requests"
            :key="order.id"
            request
            :order="order"
            :setinputs="setinputs" />
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
