import { sitesStore } from '@src/prun-api/data/sites';
import { getPlanetNameFromAddress } from '@src/prun-api/data/addresses';
import { warehousesStore } from '@src/prun-api/data/warehouses';

export function sumMapValues<T>(map: Map<T, number>) {
  let sum = 0;
  for (const value of map.values()) {
    sum += value;
  }
  return sum;
}

export function getStoreLocationName(store: PrunApi.Store) {
  let name: string | undefined = undefined;
  switch (store.type) {
    case 'STORE': {
      const site = sitesStore.getById(store.addressableId);
      name = getPlanetNameFromAddress(site?.address)!;
      break;
    }
    case 'WAREHOUSE_STORE': {
      const warehouse = warehousesStore.getById(store.addressableId);
      name = getPlanetNameFromAddress(warehouse?.address)!;
      break;
    }
  }
  return name ?? store.name!;
}