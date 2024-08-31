import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { shallowReactive } from 'vue';

type SliceState = Record<string, PrunApi.Address | null | undefined>;

const state = shallowReactive({} as SliceState);

messages({
  SHIP_SHIPS(data: { ships: PrunApi.Ship[] }) {
    for (const ship of data.ships) {
      state[ship.id] = ship.address;
    }
  },
  SHIP_DATA(data: PrunApi.Ship) {
    state[data.id] = data.address;
  },
  SITE_SITES(data: { sites: PrunApi.Site[] }) {
    for (const storage of data.sites) {
      state[storage.siteId] = storage.address;
    }
  },
  SITE_SITE(data: PrunApi.Site) {
    state[data.siteId] = data.address;
  },
  WAREHOUSE_STORAGES(data: { storages: PrunApi.Warehouse[] }) {
    for (const storage of data.storages) {
      state[storage.storeId] = storage.address;
    }
  },
  WAREHOUSE_STORAGE(data: PrunApi.Warehouse) {
    state[data.storeId] = data.address;
  },
});

export const addressesStore = {
  ...state,
};

export const getPlanetNaturalIdFromAddress = (address?: PrunApi.Address | undefined) => {
  return getPlanetLineFromAddress(address)?.entity.naturalId;
};

export const getPlanetNameFromAddress = (address?: PrunApi.Address | undefined) => {
  return getPlanetLineFromAddress(address)?.entity.name;
};

const getPlanetLineFromAddress = (address?: PrunApi.Address | undefined) => {
  if (!address) {
    return undefined;
  }

  const entry: PrunApi.AddressLine = address.lines[1];
  if (entry?.type === 'PLANET' || entry?.type === 'STATION') {
    return entry;
  }

  return address.lines.find(x => x.type === 'PLANET' || x.type === 'STATION');
};
