import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { messages } from '@src/prun-api/data/api-messages';

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

export const fxosStore = {
  ...state,
};
