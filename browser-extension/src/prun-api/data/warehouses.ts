import { createEntitySlice } from '@src/prun-api/data/utils';
import { createEntityAdapter } from '@reduxjs/toolkit';

export const warehousesAdapter = createEntityAdapter<PrunApi.Warehouse, string>({
  selectId: x => x.storeId,
});

const slice = createEntitySlice(warehousesAdapter, {
  WAREHOUSE_STORAGES(state, data: { storages: PrunApi.Warehouse[] }) {
    warehousesAdapter.setAll(state, data.storages);
    state.fetched = true;
  },
  WAREHOUSE_STORAGE(state, data: PrunApi.Warehouse) {
    warehousesAdapter.setOne(state, data);
  },
});

export const warehousesReducer = slice.reducer;
