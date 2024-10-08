<script lang="ts">
import xit from '@src/features/XIT/xit-registry';
import CXTS from '@src/features/XIT/CXTS/CXTS.vue';

xit.add({
  command: ['CXTS'],
  name: 'COMMODITY EXCHANGE TRADES',
  component: () => CXTS,
});

export default {};
</script>

<script setup lang="ts">
import { cxosStore } from '@src/infrastructure/prun-api/data/cxos';
import { computed } from 'vue';
import DateRow from '@src/features/XIT/CXTS/DateRow.vue';
import TradeRow from '@src/features/XIT/CXTS/TradeRow.vue';
import dayjs from 'dayjs';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';

const orders = computed(() => cxosStore.all.value);

interface OrderTrade {
  order: PrunApi.CXOrder;
  trade: PrunApi.CXTrade;
  date: number;
}

interface DayTrades {
  date: number;
  trades: OrderTrade[];
  totals: { [currency: string]: number };
}

const days = computed(() => {
  const trades: OrderTrade[] = [];
  for (const order of orders.value!) {
    for (const trade of order.trades) {
      trades.push({
        order,
        trade,
        date: trade.time.timestamp,
      });
    }
  }
  trades.sort((a, b) => b.date - a.date);
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

    if (!dayjs(day.date).isSame(trade.date, 'day')) {
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
  <LoadingSpinner v-if="orders === undefined" />
  <template v-else>
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
</template>
