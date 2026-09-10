<script setup lang="ts">
import PrunLink from '@src/components/PrunLink.vue';
import { fixed0, fixed4, hhmm } from '@src/utils/format';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

const { date, order, trade } = defineProps<{
  date: number;
  order: PrunApi.FXOrder;
  trade: PrunApi.FXTrade;
}>();

const total = computed(() => {
  const total = trade.amount.amount * trade.price.rate * (order.type === 'SELLING' ? 1 : -1);
  return fixed0(total);
});

const rate = computed(() => fixed4(trade.price.rate));
const ticker = computed(() => `${trade.price.base}/${trade.price.quote}`);

const typeClass = computed(() =>
  order.type === 'SELLING' ? C.OrderTypeLabel.SELLING : C.OrderTypeLabel.BUYING,
);

const onTimeClick = () => showBuffer(`FXO ${order.id.substring(0, 8)}`);
const onTickerClick = () => showBuffer(`FXOB ${ticker.value}`);
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
        {{ ticker }}
      </span>
    </td>
    <td>
      <PrunLink :command="`CO ${trade.partner.code}`">{{ trade.partner.name }}</PrunLink>
    </td>
    <td :class="C.ForExOrdersTable.number"
      >{{ fixed0(trade.amount.amount) }} {{ trade.amount.currency }}</td
    >
    <td :class="C.ForExOrdersTable.number">{{ rate }}</td>
    <td :class="C.ForExOrdersTable.number">{{ total }} {{ trade.price.quote }}</td>
  </tr>
</template>
