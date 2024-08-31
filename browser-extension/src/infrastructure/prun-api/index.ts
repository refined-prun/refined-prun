import { listenPrunApi } from '@src/infrastructure/prun-api/prun-api-listener';
import { loadFallbackPlanetData, preloadFioResponses } from '@src/infrastructure/fio/fio-api';
import { loadMaterialNames } from '@src/infrastructure/prun-ui/material-names';

export async function initializePrunApi() {
  preloadFioResponses();
  await listenPrunApi();
}

export async function loadGameData() {
  await Promise.allSettled([loadFallbackPlanetData(), loadMaterialNames()]);
}