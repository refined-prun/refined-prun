import {
  getEntityNameFromAddress,
  isSameAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';

export function getStoreName(store: PrunApi.Store): string {
  if (store.name) {
    return store.name;
  }
  switch (store.type) {
    case 'STORE': {
      const site = sitesStore.getById(store.addressableId);
      return getEntityNameFromAddress(site?.address) ?? store.id;
    }
    case 'WAREHOUSE_STORE': {
      const warehouses = warehousesStore.all.value ?? [];
      const warehouse = warehouses.find(x => x.storeId === store.id);
      return getEntityNameFromAddress(warehouse?.address) ?? store.id;
    }
    case 'SHIP_STORE': {
      const ship = shipsStore.getById(store.addressableId);
      return ship?.name ?? store.id;
    }
    default:
      return store.id;
  }
}

export function getStoreAddress(store: PrunApi.Store): PrunApi.Address | undefined {
  switch (store.type) {
    case 'STORE':
      return sitesStore.getById(store.addressableId)?.address;
    case 'WAREHOUSE_STORE': {
      const warehouses = warehousesStore.all.value ?? [];
      return warehouses.find(x => x.storeId === store.id)?.address;
    }
    case 'SHIP_STORE': {
      const ship = shipsStore.getById(store.addressableId);
      return ship?.address ?? undefined;
    }
    default:
      return undefined;
  }
}

// Find stores at the same location as the given store (excluding itself).
export function getColocatedStores(
  sourceStore: PrunApi.Store,
  allStores: PrunApi.Store[],
): PrunApi.Store[] {
  const sourceAddress = getStoreAddress(sourceStore);
  if (!sourceAddress) {
    return [];
  }
  return allStores.filter(x => {
    if (x.id === sourceStore.id) {
      return false;
    }
    const addr = getStoreAddress(x);
    return isSameAddress(sourceAddress, addr);
  });
}
