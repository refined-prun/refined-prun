import { computed } from 'vue';
import { storagesStore } from '@src/prun-api/data/storage';
import { getStoreLocationName, sumItemsValue, sumMapValues } from '@src/core/balance/utils';

type LocationName = string;

const byLocation = computed(() => {
  const inventories = new Map<LocationName, number>();
  for (const store of storagesStore.all.value) {
    const items = store.items.map(x => x.quantity!).filter(x => !!x);
    const value = sumItemsValue(items);
    if (value === 0) {
      continue;
    }

    const name = getStoreLocationName(store);
    inventories.set(name, (inventories.get(name) ?? 0) + value);
  }
  return inventories;
});

const total = computed(() => sumMapValues(byLocation.value));

export const inventory = {
  byLocation,
  total,
};
