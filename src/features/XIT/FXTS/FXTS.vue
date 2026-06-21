<script setup lang="ts">
import { fxosStore } from '@src/infrastructure/prun-api/data/fxos';
import DateRow from '@src/features/XIT/FXTS/DateRow.vue';
import TradeRow from '@src/features/XIT/FXTS/TradeRow.vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import EndlessScrollControl from '@src/components/EndlessScrollControl.vue';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { isEmpty } from 'ts-extras';

const orders = computed(() => fxosStore.all.value);

const parameters = useXitParameters();
const parsedPages = parseInt(parameters[0]);
const startingPages = Number.isNaN(parsedPages) ? 1 : Math.max(1, parsedPages);

interface OrderTrade {
  order: PrunApi.FXOrder;
  trade: PrunApi.FXTrade;
  date: number;
}

interface DayTrades {
  date: number;
  trades: OrderTrade[];
  totals: { [currency: string]: { purchases: number; sales: number } };
}

const days = computed(() => {
  const days: DayTrades[] = [];
  if (!orders.value) {
    return days;
  }

  const trades: OrderTrade[] = [];
  for (const order of orders.value) {
    for (const trade of order.trades) {
      trades.push({
        order,
        trade,
        date: trade.time.timestamp,
      });
    }
  }
  trades.sort((a, b) => b.date - a.date);
  if (isEmpty(trades)) {
    return days;
  }

  let day: DayTrades = {
    date: getDateComponent(trades[0].date),
    trades: [],
    totals: {},
  };
  days.push(day);

  for (const trade of trades) {
    if (trade.date < day.date) {
      day = {
        date: getDateComponent(trade.date),
        trades: [],
        totals: {},
      };
      days.push(day);
    }

    day.trades.push(trade);
    const currency = trade.trade.price.quote;
    const total = trade.trade.amount.amount * trade.trade.price.rate;
    const totals = (day.totals[currency] ??= { purchases: 0, sales: 0 });
    if (trade.order.type === 'SELLING') {
      totals.sales += total;
    } else {
      totals.purchases += total;
    }
  }
  return days;
});

function getDateComponent(dateTime: number) {
  return new Date(new Date(dateTime).toDateString()).getTime();
}

const daysToRender = ref(startingPages);
const visibleDays = computed(() => days.value.slice(0, daysToRender.value));
const restart = () => (daysToRender.value = startingPages);
watch(orders, restart);
</script>

<template>
  <LoadingSpinner v-if="orders === undefined" />
  <template v-else>
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Type</th>
          <th>Pair</th>
          <th>Partner</th>
          <th>Amount</th>
          <th>Rate</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isEmpty(days)">
          <td colSpan="7">No recent trades</td>
        </tr>
        <template v-else>
          <template v-for="day in visibleDays" :key="day.date">
            <DateRow :date="day.date" :totals="day.totals" :hide-totals="day.trades.length === 1" />
            <TradeRow
              v-for="trade in day.trades"
              :key="trade.trade.id"
              :date="trade.date"
              :order="trade.order"
              :trade="trade.trade" />
          </template>
        </template>
      </tbody>
    </table>
    <EndlessScrollControl :has-more="daysToRender < days.length" @load-more="daysToRender++" />
  </template>
</template>
