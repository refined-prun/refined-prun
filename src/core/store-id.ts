import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';

export function getInvStoreId(invParameter: string) {
  invParameter = invParameter.toLowerCase().trim();
  const stores = storagesStore.all.value ?? [];
  let store = stores.find(x => x.id.startsWith(invParameter));
  if (!store) {
    const site = sitesStore.getByPlanetNaturalId(invParameter);
    store = stores.find(x => x.addressableId === site?.siteId);
  }
  if (!store) {
    const warehouse = warehousesStore.getByEntityNaturalId(invParameter);
    store = stores.find(x => x.id === warehouse?.storeId);
  }
  if (!store) {
    const ship = shipsStore.getByRegistration(invParameter);
    store = stores.find(x => x.id === ship?.idShipStore);
  }
  return store;
}
