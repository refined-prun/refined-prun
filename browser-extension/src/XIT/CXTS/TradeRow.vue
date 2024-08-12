<script setup lang="ts">
import { computed, PropType } from 'vue';
import PrunCss from '@src/prun-ui/prun-css';
import { showBuffer } from '@src/util';
import { formatPrice, formatTime } from './utils';
import PrunLink from '@src/components/PrunLink.vue';

const props = defineProps({
  date: {
    type: Object as PropType<Date>,
    required: true,
  },
  order: {
    type: Object as PropType<PrunApi.CXOrder>,
    required: true,
  },
  trade: {
    type: Object as PropType<PrunApi.CXTrade>,
    required: true,
  },
});

const total = computed(() => {
  const total =
    props.trade.price.amount * props.trade.amount * (props.order.type === 'SELLING' ? 1 : -1);
  return formatPrice(total.toFixed(2));
});

const price = computed(() => formatPrice(props.trade.price.amount.toFixed(2)));
const currency = computed(() => props.trade.price.currency);

const typeClass = computed(() =>
  props.order.type === 'SELLING' ? PrunCss.OrderTypeLabel.SELLING : PrunCss.OrderTypeLabel.BUYING,
);
const fullTicker = computed(() => `${props.order.material.ticker}.${props.order.exchange.code}`);

const onTimeClick = () => showBuffer(`CXO ${props.order.id.substring(0, 8)}`);
const onTickerClick = () => showBuffer(`CXOB ${fullTicker.value}`);
</script>

<template>
  <tr>
    <td>
      <span :class="PrunCss.Link.link" @click="onTimeClick">
        {{ formatTime(date) }}
      </span>
    </td>
    <td>
      <span :class="typeClass">{{ order.type === 'SELLING' ? 'SELL' : 'BUY' }}</span>
    </td>
    <td>
      <span :class="PrunCss.Link.link" @click="onTickerClick">
        {{ fullTicker }}
      </span>
    </td>
    <td>
      <PrunLink :command="`CO ${trade.partner.code}`">{{ trade.partner.name }}</PrunLink>
    </td>
    <td :class="PrunCss.ComExOrdersTable.number">{{ trade.amount }}</td>
    <td :class="PrunCss.ComExOrdersTable.number">{{ price }} {{ currency }}</td>
    <td :class="PrunCss.ComExOrdersTable.number">{{ total }} {{ currency }}</td>
  </tr>
</template>
