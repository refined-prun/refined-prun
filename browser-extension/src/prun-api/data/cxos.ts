import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { messages } from '@src/prun-api/data/api-messages';
import { request } from '@src/prun-api/data/request-hooks';
import { computed } from 'vue';

const store = createEntityStore<PrunApi.CXOrder>();
const state = store.state;

messages({
  COMEX_TRADER_ORDERS(data: { orders: PrunApi.CXOrder[] }) {
    store.setAll(data.orders);
    store.setFetched();
  },
  COMEX_TRADER_ORDER_ADDED(data: PrunApi.CXOrder) {
    store.addOne(data);
  },
  COMEX_TRADER_ORDER_UPDATED(data: PrunApi.CXOrder) {
    store.setOne(data);
  },
  COMEX_TRADER_ORDER_REMOVED(data: { orderId: string }) {
    store.removeOne(data.orderId);
  },
});

const all = (() => {
  const all = state.all;
  return computed(() => {
    if (!state.fetched.value) {
      request.cxos();
    }

    return all.value;
  });
})();

export const cxosStore = {
  ...state,
  all,
};
