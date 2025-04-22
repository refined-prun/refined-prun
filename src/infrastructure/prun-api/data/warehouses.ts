import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';

const store = createEntityStore<PrunApi.Warehouse>(x => x.warehouseId);
const state = store.state;

onApiMessage({
  WAREHOUSE_STORAGES(data: { storages: PrunApi.Warehouse[] }) {
    store.setAll(data.storages);
    store.setFetched();
  },
  WAREHOUSE_STORAGE(data: PrunApi.Warehouse) {
    store.setOne(data);
  },
  WAREHOUSE_STORAGE_REMOVED(data: { warehouseId: string }) {
    store.removeOne(data.warehouseId);
  },
});

const getByEntityNaturalId = createMapGetter(
  state.all,
  x => getEntityNaturalIdFromAddress(x.address)!,
);

const getByEntityName = createMapGetter(state.all, x => getEntityNameFromAddress(x.address)!);

const getByEntityNaturalIdOrName = (value?: string | null) =>
  getByEntityNaturalId(value) ?? getByEntityName(value);

export const warehousesStore = {
  ...state,
  getByEntityNaturalId,
  getByEntityName,
  getByEntityNaturalIdOrName,
};
