import { listenPrunApi } from '@src/infrastructure/prun-api/prun-api-listener';
import { loadFallbackPlanetData, preloadFioResponses } from '@src/infrastructure/fio/fio-api';

export function initializePrunApi() {
  preloadFioResponses();
  listenPrunApi();
}

export async function loadGameData() {
  await loadFallbackPlanetData();
}
