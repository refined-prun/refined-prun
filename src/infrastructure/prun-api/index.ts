import { startRelay } from '@src/infrastructure/prun-api/relay';
import {
  initialApiLoadingComplete,
  listenPrunApi,
} from '@src/infrastructure/prun-api/prun-api-listener';
import { loadFallbackPlanetData, preloadFioResponses } from '@src/infrastructure/fio/fio-api';
import { watchUntil } from '@src/utils/watch';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { alertsStore } from '@src/infrastructure/prun-api/data/alerts';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { uiDataStore } from '@src/infrastructure/prun-api/data/ui-data';
import { balancesStore } from '@src/infrastructure/prun-api/data/balances';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { starsStore } from '@src/infrastructure/prun-api/data/stars';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import { fetchPrices } from '@src/infrastructure/fio/cx';

export async function initializeApi() {
  startRelay();
  void fetchPrices();
  preloadFioResponses();
  listenPrunApi();
  const startupStores = [
    alertsStore,
    balancesStore,
    contractsStore,
    flightsStore,
    materialsStore,
    shipsStore,
    sitesStore,
    starsStore,
    storagesStore,
    warehousesStore,
  ];
  await watchUntil(
    () =>
      uiDataStore.screens !== undefined &&
      companyStore.value !== undefined &&
      startupStores.every(x => x.fetched.value),
  );
  await loadFallbackPlanetData();
}

export function finishApiInitialization() {
  initialApiLoadingComplete.value = true;
}
