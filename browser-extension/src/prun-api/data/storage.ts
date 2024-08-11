import { createEntitySlice } from '@src/prun-api/data/utils';
import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { State } from '@src/prun-api/data/store';

export const storesAdapter = createEntityAdapter<PrunApi.Store>();

const slice = createEntitySlice(storesAdapter, {
  STORAGE_STORAGES(state, data: { stores: PrunApi.Store[] }) {
    storesAdapter.setAll(state, data.stores);
    state.fetched = true;
  },
  STORAGE_CHANGE(state, data: { stores: PrunApi.Store[] }) {
    storesAdapter.setMany(state, data.stores);
  },
});

export const storageReducer = slice.reducer;

const selectors = storesAdapter.getSelectors((state: State) => state.storage);

const selectStorageAddressMap = createSelector(selectors.selectAll, stores => {
  const map = new Map<string, PrunApi.Store[]>();
  for (const store of stores) {
    let byAddress = map.get(store.addressableId);
    if (!byAddress) {
      byAddress = [];
      map.set(store.addressableId, byAddress);
    }
    byAddress.push(store);
  }
  return map;
});

export const selectStorageByAddress = (state: State, address: string) => selectStorageAddressMap(state).get(address);
