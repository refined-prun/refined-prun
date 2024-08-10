import { createEntitySlice } from '@src/prun-api/data/utils';
import { createEntityAdapter } from '@reduxjs/toolkit';

export const storesAdapter = createEntityAdapter<PrunApi.Store>();

const slice = createEntitySlice(storesAdapter, {
  STORAGE_STORAGES(state, data: { stores: PrunApi.Store[] }) {
    storesAdapter.setAll(state, data.stores);
    state.fetched = true;
  },
  STORAGE_CHANGE(state, data: { stores: PrunApi.Store[] }) {
    storesAdapter.setAll(state, data.stores);
  },
});

export const storesReducer = slice.reducer;
