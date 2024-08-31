import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { computed } from 'vue';
import { request } from '@src/infrastructure/prun-api/data/request-hooks';

const store = createEntityStore<PrunApi.FXOrder>();
const state = store.state;

messages({
  FOREX_TRADER_ORDERS(data: { orders: PrunApi.FXOrder[] }) {
    store.setAll(data.orders);
    store.setFetched();
  },
  FOREX_TRADER_ORDER_ADDED(data: PrunApi.FXOrder) {
    store.addOne(data);
  },
  FOREX_TRADER_ORDER_UPDATED(data: PrunApi.FXOrder) {
    store.setOne(data);
  },
  FOREX_TRADER_ORDER_REMOVED(data: { orderId: string }) {
    store.removeOne(data.orderId);
  },
});

const all = (() => {
  const all = state.all;
  return computed(() => {
    if (!state.fetched.value) {
      request.fxos();
    }

    return all.value;
  });
})();

const active = computed(() => all.value.filter(x => x.status !== 'FILLED'));

export const fxosStore = {
  ...state,
  all,
  active,
};
