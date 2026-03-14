import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { comparePlanets } from '@src/util';
import { groupTargetPrefix } from '@src/features/XIT/ACT/shared-types';

export function useContLocations() {
  return computed(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const store of storagesStore.nonFuelStores.value ?? []) {
      let address: PrunApi.Address | undefined;
      if (store.type === 'STORE') {
        address = sitesStore.getById(store.addressableId)?.address;
      } else if (store.type === 'WAREHOUSE_STORE') {
        address = warehousesStore.getById(store.addressableId)?.address;
      } else {
        continue;
      }
      const name = getEntityNameFromAddress(address);
      if (name && !seen.has(name)) {
        seen.add(name);
        result.push(name);
      }
    }
    return result.sort(comparePlanets);
  });
}

export function displayLocationValue(value: string | undefined) {
  if (!value) {
    return '--';
  }
  if (value.startsWith(groupTargetPrefix)) {
    return `[${value.slice(groupTargetPrefix.length)}] target`;
  }
  return value;
}
