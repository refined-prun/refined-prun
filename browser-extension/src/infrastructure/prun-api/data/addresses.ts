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

export const getEntityNaturalIdFromAddress = (address?: PrunApi.Address | undefined) => {
  return getLocationLineFromAddress(address)?.entity.naturalId;
};

export const getEntityNameFromAddress = (address?: PrunApi.Address | undefined) => {
  const location = getLocationLineFromAddress(address);
  if (!location) {
    return undefined;
  }

  if (location.type !== 'PLANET' || location.entity.name !== location.entity.naturalId) {
    return location.entity.name;
  }

  const system = getSystemLineFromAddress(address);
  if (!system || system.entity.name === system.entity.naturalId) {
    return location.entity.name;
  }

  return location.entity.name.replace(system.entity.naturalId, `${system.entity.name} `);
};

const getSystemLineFromAddress = (address?: PrunApi.Address | undefined) => {
  if (!address) {
    return undefined;
  }
  return isSystemLine(address.lines[0]) ? address.lines[0] : address.lines.find(isSystemLine);
};

const getLocationLineFromAddress = (address?: PrunApi.Address | undefined) => {
  if (!address) {
    return undefined;
  }
  return isLocationLine(address.lines[1]) ? address.lines[1] : address.lines.find(isLocationLine);
};

function isSystemLine(line?: PrunApi.AddressLine) {
  return line?.type === 'SYSTEM';
}

function isLocationLine(line?: PrunApi.AddressLine) {
  return line?.type === 'PLANET' || line?.type === 'STATION';
}
