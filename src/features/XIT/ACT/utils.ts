// Parse storage payload into inventory name (not MTRA inventory name)
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';

export function parseStorageName(storage: PrunApi.Store) {
  switch (storage.type) {
    case 'STL_FUEL_STORE':
      return storage.name + ' STL Store';
    case 'FTL_FUEL_STORE':
      return storage.name + ' FTL Store';
    case 'SHIP_STORE':
      return storage.name + ' Cargo';
    case 'STORE': {
      const site = sitesStore.getById(storage.addressableId);
      return getEntityNameFromAddress(site?.address) + ' Base';
    }
    case 'WAREHOUSE_STORE': {
      const warehouse = warehousesStore.getById(storage.addressableId);
      return getEntityNameFromAddress(warehouse?.address) + ' Warehouse';
    }
  }

  return 'Error, unable to parse';
}
