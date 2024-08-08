import { createEntitySlice } from '@src/prun-api/data/utils';
import { createEntityAdapter } from '@reduxjs/toolkit';

export const fxosAdapter = createEntityAdapter<PrunApi.FXOrder>();

const slice = createEntitySlice(fxosAdapter, {
  FOREX_TRADER_ORDERS(state, data: { orders: PrunApi.FXOrder[] }) {
    fxosAdapter.setAll(state, data.orders);
    state.fetched = true;
  },
  FOREX_TRADER_ORDER_ADDED(state, data: PrunApi.FXOrder) {
    fxosAdapter.addOne(state, data);
  },
  FOREX_TRADER_ORDER_UPDATED(state, data: PrunApi.FXOrder) {
    fxosAdapter.setOne(state, data);
  },
  FOREX_TRADER_ORDER_REMOVED(state, data: { orderId: string }) {
    fxosAdapter.removeOne(state, data.orderId);
  },
});

export const fxosReducer = slice.reducer;
