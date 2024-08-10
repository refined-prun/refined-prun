import { listenPrunApi } from '@src/prun-api/prun-api-listener';
import { loadFallbackPlanetData, preloadFioResponses } from '@src/fio/fio-api';
import prun from '@src/prun-api/prun';
import { loadMaterialNames } from '@src/prun-ui/material-names';

export async function initializePrunApi() {
  preloadFioResponses();
  await listenPrunApi();
}

export async function loadGameData() {
  await Promise.allSettled([prun.systems.load(), prun.planets.load(), loadFallbackPlanetData(), loadMaterialNames()]);
}
