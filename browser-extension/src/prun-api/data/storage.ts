import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { messages } from '@src/prun-api/data/api-messages';
import { computed } from 'vue';

const store = createEntityStore<PrunApi.Store>();
const state = store.state;

messages({
  STORAGE_STORAGES(data: { stores: PrunApi.Store[] }) {
    store.setAll(data.stores);
    store.setFetched();
  },
  STORAGE_CHANGE(data: { stores: PrunApi.Store[] }) {
    store.setMany(data.stores);
  },
});

const byAddress = computed(() => {
  const map = new Map<string, PrunApi.Store[]>();
  for (const store of state.all.value) {
    let byAddress = map.get(store.addressableId);
    if (!byAddress) {
      byAddress = [];
      map.set(store.addressableId, byAddress);
    }
    byAddress.push(store);
  }
  return map;
});

export const storagesStore = {
  ...state,
  getByAddress: (address?: string | null) => (address ? byAddress.value.get(address) : undefined),
};
