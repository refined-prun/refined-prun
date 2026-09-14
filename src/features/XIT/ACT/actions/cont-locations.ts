import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { comparePlanets } from '@src/util';
import { configurableValue, groupTargetPrefix } from '@src/features/XIT/ACT/shared-types';

/** Contract endpoints with player storage, shared by CONT actions and configure forms. */
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
      if (name !== undefined && !seen.has(name)) {
        seen.add(name);
        result.push(name);
      }
    }
    return result.sort(comparePlanets);
  });
}

/**
 * Resolves a stored location value to a planet name: a literal name passes
 * through, `configurableValue` reads the run's configure dialog, and a
 * `group:` reference follows the named material group's target planet.
 */
export function resolveLocation(
  value: string | undefined,
  configValue: string | undefined,
  getMaterialGroupPlanet: (name: string) => string | undefined,
) {
  if (value === undefined) {
    return undefined;
  }
  if (value === configurableValue) {
    return configValue;
  }
  if (value.startsWith(groupTargetPrefix)) {
    return getMaterialGroupPlanet(value.slice(groupTargetPrefix.length));
  }
  return value;
}

export function displayLocationValue(value: string | undefined) {
  if (value === undefined || value.length === 0) {
    return '--';
  }
  if (value.startsWith(groupTargetPrefix)) {
    return `[${value.slice(groupTargetPrefix.length)}] target`;
  }
  return value;
}
