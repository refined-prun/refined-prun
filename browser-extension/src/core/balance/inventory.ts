import { computed } from 'vue';
import { storagesStore } from '@src/prun-api/data/storage';
import { getStoreLocationName, sumItemsValue, sumMapValues } from '@src/core/balance/utils';
import { shipyardProjectsStore } from '@src/prun-api/data/shipyard-projects';
import { shipyardsStore } from '@src/prun-api/data/shipyards';
import { getPlanetNameFromAddress } from '@src/prun-api/data/addresses';

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
  for (const project of shipyardProjectsStore.all.value.filter(x => x.status === 'CREATED')) {
    const value = sumItemsValue(project.inventory.items);
    if (value === 0) {
      continue;
    }

    const shipyard = shipyardsStore.getById(project.shipyardId);
    if (!shipyard) {
      continue;
    }

    const name = getPlanetNameFromAddress(shipyard.address)!;
    inventories.set(name, (inventories.get(name) ?? 0) + value);
  }
  return inventories;
});

const total = computed(() => sumMapValues(byLocation.value));

export const inventory = {
  byLocation,
  total,
};
