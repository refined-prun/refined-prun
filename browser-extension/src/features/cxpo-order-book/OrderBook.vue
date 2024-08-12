<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import usePrunSelector from '@src/hooks/use-prun-selector';
import { selectCxobByTicker } from '@src/prun-api/data/cxob';
import OrderRow from '@src/features/cxpo-order-book/OrderRow.vue';
import PrunCss from '@src/prun-ui/prun-css';

const props = defineProps({
  ticker: {
    type: String,
    required: true,
  },
});

const orderInfo = usePrunSelector(s => selectCxobByTicker(s, props.ticker));

const offers = computed(() => (orderInfo.value?.sellingOrders ?? []).slice().reverse());
const requests = computed(() => orderInfo.value?.buyingOrders ?? []);
const spread = computed(() => {
  const ask = orderInfo.value?.ask?.price.amount;
  const bid = orderInfo.value?.bid?.price.amount;
  return ask && bid ? (ask - bid).toFixed(2) : '--';
});

const orderBook = ref(undefined);
const offerBody = ref(undefined);
watchEffect(() => {
  if (!orderBook.value || !offerBody.value) {
    return;
  }

  (orderBook.value! as HTMLDivElement).scrollTop = Math.max(
    (offerBody.value! as HTMLDivElement).offsetHeight - 90,
    0,
  );
});
</script>

<template>
  <div ref="orderBook" :class="$style.container">
    <table>
      <thead>
        <tr>
          <th>Amt.</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody ref="offerBody">
        <tr>
          <th colSpan="2">Offers</th>
        </tr>
        <template v-if="offers.length > 0">
          <OrderRow v-for="order in offers" :key="order.id" :order="order" />
        </template>
        <tr v-else>
          <td :class="PrunCss.ComExOrderBookPanel.empty" colSpan="2">No offers.</td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td colSpan="{2}" class="{PrunCss.ComExOrderBookPanel.spread}">
            Spread: <span :style="{ color: '#eee' }">{{ spread }}</span>
          </td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <th colSpan="2">Requests</th>
        </tr>
        <template v-if="requests.length > 0">
          <OrderRow v-for="order in requests" :key="order.id" request :order="order" />
        </template>
        <tr v-else>
          <td :class="PrunCss.ComExOrderBookPanel.empty" colSpan="2">No requests.</td>
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
</style>
