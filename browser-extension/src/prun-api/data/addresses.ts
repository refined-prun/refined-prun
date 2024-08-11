import { caseReducers } from '@src/prun-api/data/utils';
import { createSlice } from '@reduxjs/toolkit';
import { State } from '@src/prun-api/data/store';

type SliceState = Record<string, PrunApi.Address | null | undefined>;

const slice = createSlice({
  name: 'addresses',
  initialState: {} as SliceState,
  reducers: {},
  extraReducers: builder =>
    caseReducers(builder, {
      SHIP_SHIPS(state, data: { ships: PrunApi.Ship[] }) {
        for (const ship of data.ships) {
          state[ship.id] = ship.address;
        }
      },
      SHIP_DATA(state, data: PrunApi.Ship) {
        state[data.id] = data.address;
      },
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

export const getPlanetNaturalIdFromAddress = (address: PrunApi.Address) => {
  return getPlanetLineFromAddress(address)?.entity.naturalId;
};

export const getPlanetNameFromAddress = (address: PrunApi.Address) => {
  return getPlanetLineFromAddress(address)?.entity.name;
};

const getPlanetLineFromAddress = (address: PrunApi.Address) => {
  const entry: PrunApi.AddressLine = address.lines[1];
  if (entry?.type === 'PLANET') {
    return entry;
  }

  return address.lines.find(x => x.type === 'PLANET');
};

export const selectPlanetNaturalIdByAddress = (state: State, address: string) => {
  const entry = state.addresses[address];
  return entry ? getPlanetNaturalIdFromAddress(entry) : undefined;
};
