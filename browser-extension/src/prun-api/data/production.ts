import { caseReducers } from '@src/prun-api/data/utils';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { State } from '@src/prun-api/data/store';

export const linesAdapter = createEntityAdapter<PrunApi.ProductionLine>();

const slice = createSlice({
  name: 'production',
  initialState: {
    lines: linesAdapter.getInitialState(),
    bySiteId: {} as Record<string, PrunApi.ProductionLine[] | undefined>,
  },
  reducers: {},
  extraReducers: builder =>
    caseReducers(builder, {
      PRODUCTION_SITE_PRODUCTION_LINES(
        state,
        data: {
          siteId: string;
          productionLines: PrunApi.ProductionLine[];
        },
      ) {
        linesAdapter.setAll(state.lines, data.productionLines);
        state.bySiteId[data.siteId] = data.productionLines;
      },
      PRODUCTION_ORDER_ADDED(state, data: PrunApi.ProductionOrder) {
        const line = state.lines.entities[data.productionLineId];
        if (!line) {
          return;
        }
        line.orders.push(data);
      },
      PRODUCTION_ORDER_UPDATED(state, data: PrunApi.ProductionOrder) {
        const line = state.lines.entities[data.productionLineId];
        if (!line) {
          return;
        }
        line.orders = line.orders.map(x => (x.id === data.id ? data : x));
      },
      PRODUCTION_ORDER_REMOVED(state, data: { orderId: string; productionLineId: string }) {
        const line = state.lines.entities[data.productionLineId];
        if (!line) {
          return;
        }
        line.orders = line.orders.filter(x => x.id !== data.orderId);
      },
    }),
});

export const productionReducer = slice.reducer;

export const selectProductionLinesBySiteId = (state: State, siteId: string) =>
  state.production.bySiteId[siteId];
