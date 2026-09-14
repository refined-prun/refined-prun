import { storagesStore } from '@src/infrastructure/prun-api/data/storage';

export const allExchangesValue = 'All Exchanges';

export function getRefuelOrigins() {
  return storagesStore.nonFuelStores.value ?? [];
}
