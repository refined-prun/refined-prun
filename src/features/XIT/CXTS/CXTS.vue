<script setup lang="ts">
import { cxosStore } from '@src/infrastructure/prun-api/data/cxos';
import DateRow from '@src/features/XIT/CXTS/DateRow.vue';
import TradeRow from '@src/features/XIT/CXTS/TradeRow.vue';
import dayjs from 'dayjs';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { isEmpty } from 'ts-extras';
import { clamp } from '@src/utils/clamp';

const orders = computed(() => cxosStore.all.value);

interface OrderTrade {
  order: PrunApi.CXOrder;
  trade: PrunApi.CXTrade;
  date: number;
}

interface DayTrades {
  date: number;
  trades: OrderTrade[];
  totals: { [currency: string]: { purchases: number; sales: number } };
}

const msInDay = dayjs.duration(1, 'day').asMilliseconds();

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
    const mat = trade.order.material;
    if (!mat) {
      continue;
    }

    if (trade.date < day.date) {
      day = {
        date: day.date - msInDay,
        trades: [],
        totals: {},
      };
      days.push(day);
    }

    day.trades.push(trade);
    const currency = trade.trade.price.currency;
    const total = trade.trade.price.amount * trade.trade.amount;
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

const daysToRender = ref(1);
let id = 0;

function stepRender() {
  id = requestAnimationFrame(stepRender);
  if (!orders.value) {
    daysToRender.value = 1;
  } else {
    daysToRender.value = clamp(daysToRender.value + 1, 0, days.value.length);
  }
}

onBeforeUnmount(() => cancelAnimationFrame(id));
stepRender();
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
        <tr v-if="isEmpty(days)">
          <td colSpan="7">No recent trades</td>
        </tr>
        <template v-else>
          <template v-for="group in daysToRender" :key="days[group - 1].date">
            <DateRow :date="days[group - 1].date" :totals="days[group - 1].totals" />
            <TradeRow
              v-for="trade in days[group - 1].trades"
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
