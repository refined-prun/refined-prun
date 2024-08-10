import { caseReducers } from '@src/prun-api/data/utils';
import { createSlice } from '@reduxjs/toolkit';

type SliceState = Record<string, PrunApi.Address>;

const slice = createSlice({
  name: 'addresses',
  initialState: {} as SliceState,
  reducers: {},
  extraReducers: builder =>
    caseReducers(builder, {
      SITE_SITES(state, data: { sites: PrunApi.Site[] }) {
        for (const storage of data.sites) {
          state[storage.siteId] = storage.address;
        }
      },
      SITE_SITE(state, data: PrunApi.Site) {
        state[data.siteId] = data.address;
      },
      WAREHOUSE_STORAGES(state, data: { storages: PrunApi.Warehouse[] }) {
        for (const storage of data.storages) {
          state[storage.storeId] = storage.address;
        }
      },
      WAREHOUSE_STORAGE(state, data: PrunApi.Warehouse) {
        state[data.storeId] = data.address;
      },
    }),
});

export const addressesReducer = slice.reducer;
