import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { messages } from '@src/prun-api/data/api-messages';

const store = createEntityStore<PrunApi.Warehouse>(x => x.storeId);
const state = store.state;

messages({
  WAREHOUSE_STORAGES(data: { storages: PrunApi.Warehouse[] }) {
    store.setAll(data.storages);
    store.setFetched();
  },
  WAREHOUSE_STORAGE(data: PrunApi.Warehouse) {
    store.setOne(data);
  },
});

export const warehousesStore = {
  ...state,
};
