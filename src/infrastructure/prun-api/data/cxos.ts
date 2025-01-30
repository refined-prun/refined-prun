import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { request } from '@src/infrastructure/prun-api/data/request-hooks';

const store = createEntityStore<PrunApi.CXOrder>();
const state = store.state;

onApiMessage({
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

const active = computed(() => all.value?.filter(x => x.status !== 'FILLED'));

export const cxosStore = {
  ...state,
  all,
  active,
};
