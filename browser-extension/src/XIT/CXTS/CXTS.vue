<script lang="ts">
import xit from '@src/XIT/xit-registry';
import features from '@src/feature-registry';
import CXTS from '@src/XIT/CXTS/CXTS.vue';

function init() {
  xit.add({
    command: ['CXTS'],
    name: 'COMMODITY EXCHANGE TRADES',
    vueComponent: CXTS,
  });
}

features.add({
  id: 'xit-cxts',
  init,
});

export default {};
</script>

<script setup lang="ts">
import { cxosStore } from '@src/prun-api/data/cxos';
import { computed } from 'vue';
import DateRow from '@src/XIT/CXTS/DateRow.vue';
import TradeRow from '@src/XIT/CXTS/TradeRow.vue';
import { sameDay } from '@src/XIT/CXTS/utils';

const orders = cxosStore.all;

interface OrderTrade {
  order: PrunApi.CXOrder;
  trade: PrunApi.CXTrade;
  date: Date;
}

interface DayTrades {
  date: Date;
  trades: OrderTrade[];
  totals: { [currency: string]: number };
}

const days = computed(() => {
  const trades: OrderTrade[] = [];
  for (const order of orders.value) {
    for (const trade of order.trades) {
      trades.push({
        order,
        trade,
        date: new Date(trade.time.timestamp),
      });
    }
  }
  trades.sort((a, b) => b.date.getTime() - a.date.valueOf());
  const days: DayTrades[] = [];
  if (trades.length === 0) {
    return days;
  }

  let day: DayTrades = {
    date: trades[0].date,
    trades: [],
    totals: {},
  };
  days.push(day);

  for (const trade of trades) {
    const mat = trade.order.material;
    if (!mat) {
      continue;
    }

    if (!sameDay(day.date, trade.date)) {
      day = {
        date: trade.date,
        trades: [],
        totals: {},
      };
      days.push(day);
    }

    day.trades.push(trade);
    const total =
      trade.trade.price.amount * trade.trade.amount * (trade.order.type === 'SELLING' ? 1 : -1);
    const currency = trade.trade.price.currency;
    day.totals[currency] = (day.totals[currency] ?? 0) + total;
  }
  return days;
});
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Time</th>
        <th>Type</th>
        <th>Ticker</th>
        <th>Partner</th>
        <th>Amount</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="days.length === 0">
        <td colSpan="7">
          <template v-if="orders.length === 0">No (partially) filled orders</template>
          <template v-else>No recent trades</template>
        </td>
      </tr>
      <template v-else>
        <template v-for="group in days" :key="group.date">
          <DateRow :date="group.date" :totals="group.totals" />
          <TradeRow
            v-for="trade in group.trades"
            :key="trade.trade.id"
            :date="trade.date"
            :order="trade.order"
            :trade="trade.trade" />
        </template>
      </template>
    </tbody>
  </table>
</template>
