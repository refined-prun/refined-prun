import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
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
      // Warehouse addressableId matches the warehouse's storeId in the warehouses store.
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
