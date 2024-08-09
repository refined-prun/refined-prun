import { createEntitySlice } from '@src/prun-api/data/utils';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { State } from '@src/prun-api/data/store';

export const cxosAdapter = createEntityAdapter<PrunApi.CXOrder>();

const slice = createEntitySlice(cxosAdapter, {
  COMEX_TRADER_ORDERS(state, data: { orders: PrunApi.CXOrder[] }) {
    cxosAdapter.setAll(state, data.orders);
    state.fetched = true;
  },
  COMEX_TRADER_ORDER_ADDED(state, data: PrunApi.CXOrder) {
    cxosAdapter.addOne(state, data);
  },
  COMEX_TRADER_ORDER_UPDATED(state, data: PrunApi.CXOrder) {
    cxosAdapter.setOne(state, data);
  },
  COMEX_TRADER_ORDER_REMOVED(state, data: { orderId: string }) {
    cxosAdapter.removeOne(state, data.orderId);
  },
});

export const cxosReducer = slice.reducer;

const selectors = cxosAdapter.getSelectors((s: State) => s.cxos);
export const selectCxos = selectors.selectAll;
export const selectCxosTotal = selectors.selectTotal;
