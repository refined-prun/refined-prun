import { listenPrunApi } from '@src/prun-api/prun-api-listener';
import { preloadFioResponses } from '@src/fio/fio-api';
import prun from '@src/prun-api/prun';

export async function initializePrunApi() {
  preloadFioResponses();
  await listenPrunApi();
}

export async function loadGameData() {
  await Promise.allSettled([prun.materials.load(), prun.systems.load(), prun.planets.load()]);
}
