import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';

export function getInvStore(invParameter: string | null | undefined) {
  if (!invParameter) {
    return undefined;
  }
  invParameter = invParameter.toLowerCase().trim();
  let store = storagesStore.getById(invParameter);
  if (!store) {
    const warehouse = warehousesStore.getByEntityNaturalId(invParameter);
    store = storagesStore.getById(warehouse?.storeId);
  }
  if (!store) {
    const ship = shipsStore.getByRegistration(invParameter);
    store = storagesStore.getById(ship?.idShipStore);
  }
  if (!store) {
    const site = sitesStore.getByPlanetNaturalId(invParameter);
    store = storagesStore.all.value?.find(x => x.addressableId === site?.siteId);
  }
  return store;
}
