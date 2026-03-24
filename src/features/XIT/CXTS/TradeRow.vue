<script setup lang="ts">
import PrunLink from '@src/components/PrunLink.vue';
import { fixed0, fixed2, hhmm } from '@src/utils/format';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

const { date, order, trade } = defineProps<{
  date: number;
  order: PrunApi.CXOrder;
  trade: PrunApi.CXTrade;
}>();

const total = computed(() => {
  const total = trade.price.amount * trade.amount * (order.type === 'SELLING' ? 1 : -1);
  return fixed0(total);
});

const price = computed(() => fixed2(trade.price.amount));
const currency = computed(() => trade.price.currency);

const typeClass = computed(() =>
  order.type === 'SELLING' ? C.OrderTypeLabel.SELLING : C.OrderTypeLabel.BUYING,
);
const fullTicker = computed(() => `${order.material.ticker}.${order.exchange.code}`);

const onTimeClick = () => showBuffer(`CXO ${order.id.substring(0, 8)}`);
const onTickerClick = () => showBuffer(`CXOB ${fullTicker.value}`);
</script>

<template>
  <tr>
    <td>
      <span :class="C.Link.link" @click="onTimeClick">
        {{ hhmm(date) }}
      </span>
    </td>
    <td>
      <span :class="typeClass">{{ order.type === 'SELLING' ? 'SELL' : 'BUY' }}</span>
    </td>
    <td>
      <span :class="C.Link.link" @click="onTickerClick">
        {{ fullTicker }}
      </span>
    </td>
    <td>
      <PrunLink :command="`CO ${trade.partner.code}`">{{ trade.partner.name }}</PrunLink>
    </td>
    <td :class="C.ComExOrdersTable.number">{{ fixed0(trade.amount) }}</td>
    <td :class="C.ComExOrdersTable.number">{{ price }} {{ currency }}</td>
    <td :class="C.ComExOrdersTable.number">{{ total }} {{ currency }}</td>
  </tr>
</template>
