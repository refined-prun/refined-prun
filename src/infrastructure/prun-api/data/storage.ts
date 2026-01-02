import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import {
  createGroupMapGetter,
  createMapGetter,
} from '@src/infrastructure/prun-api/data/create-map-getter';

const store = createEntityStore<PrunApi.Store>();
const state = store.state;

onApiMessage({
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

const getById = (value?: string | null) => state.getById(value) ?? getByShortId(value);

const getByAddressableId = createGroupMapGetter(state.all, x => x.addressableId);

const getByName = createGroupMapGetter(state.all, x => x.name ?? '');

// The features only work with personal storages, so
// filter out the infrastructure construction stores.
const personal = computed(() => state.all.value?.filter(isPersonalStorage));

function isPersonalStorage(storage: PrunApi.Store) {
  return storage.type !== 'CONSTRUCTION_STORE' && storage.type !== 'UPKEEP_STORE';
}

export const storagesStore = {
  ...state,
  all: personal,
  getById,
  getByAddressableId,
  getByName,
};
