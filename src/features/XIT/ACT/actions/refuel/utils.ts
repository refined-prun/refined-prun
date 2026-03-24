import { storagesStore } from '@src/infrastructure/prun-api/data/storage';

export function getRefuelOrigins() {
  return storagesStore.nonFuelStores.value ?? [];
}
