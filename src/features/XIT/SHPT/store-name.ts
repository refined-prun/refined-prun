import {
  getEntityNameFromAddress,
  isSameAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';

interface StoreInfo {
  name: string;
  address: PrunApi.Address | undefined;
}

function resolveStore(store: PrunApi.Store): StoreInfo {
  switch (store.type) {
    case 'STORE': {
      const site = sitesStore.getById(store.addressableId);
      return {
        name: store.name ?? getEntityNameFromAddress(site?.address) ?? store.id,
        address: site?.address,
      };
    }
    case 'WAREHOUSE_STORE': {
      const warehouses = warehousesStore.all.value ?? [];
      const warehouse = warehouses.find(x => x.storeId === store.id);
      return {
        name: store.name ?? getEntityNameFromAddress(warehouse?.address) ?? store.id,
        address: warehouse?.address,
      };
    }
    case 'SHIP_STORE': {
      const ship = shipsStore.getById(store.addressableId);
      return {
        name: store.name ?? ship?.name ?? store.id,
        address: ship?.address ?? undefined,
      };
    }
    default:
      return { name: store.name ?? store.id, address: undefined };
  }
}

export function getStoreName(store: PrunApi.Store): string {
  return resolveStore(store).name;
}

export function getStoreAddress(store: PrunApi.Store): PrunApi.Address | undefined {
  return resolveStore(store).address;
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
    return isSameAddress(sourceAddress, getStoreAddress(x));
  });
}
