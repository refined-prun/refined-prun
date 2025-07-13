import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { userDataStore } from '@src/infrastructure/prun-api/data/user-data';

// MM orders don't have the amount.
export function isFiniteOrder(
  order: PrunApi.CXBrokerOrder,
): order is PrunApi.CXBrokerOrder & { amount: number } {
  return order.amount !== null;
}

// If any line has a recurring order, we consider all lines to have recurring orders.
const hasRecurringOrders = computed(() => {
  if (userDataStore.subscriptionLevel !== 'PRO') {
    return false;
  }
  return productionStore.all.value?.some(line => line.orders.some(x => x.recurring)) ?? false;
});

export function getRecurringOrders(line: PrunApi.ProductionLine) {
  return hasRecurringOrders.value
    ? line.orders.filter(x => !x.started && x.recurring)
    : line.orders.filter(x => !x.started);
}
