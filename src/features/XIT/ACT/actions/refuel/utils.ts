import { storagesStore } from '@src/infrastructure/prun-api/data/storage';

export function getRefuelOrigins() {
  return (storagesStore.all.value ?? []).filter(
    x => x.type !== 'FTL_FUEL_STORE' && x.type !== 'STL_FUEL_STORE',
  );
}
