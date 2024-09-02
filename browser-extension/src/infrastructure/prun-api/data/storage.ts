import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import {
  createGroupMapGetter,
  createMapGetter,
} from '@src/infrastructure/prun-api/data/create-map-getter';

const store = createEntityStore<PrunApi.Store>();
const state = store.state;

messages({
  STORAGE_STORAGES(data: { stores: PrunApi.Store[] }) {
    store.setMany(data.stores);
    store.setFetched();
  },
  STORAGE_CHANGE(data: { stores: PrunApi.Store[] }) {
    store.setMany(data.stores);
  },
  STORAGE_REMOVED(data: { storeIds: string[] }) {
    for (const id of data.storeIds) {
      store.removeOne(id);
    }
  },
});

const getByShortId = createMapGetter(state.all, x => x.id.substring(0, 8));
const getByAddress = createGroupMapGetter(state.all, x => x.addressableId);

export const storagesStore = {
  ...state,
  getByShortId,
  getByAddress,
};
