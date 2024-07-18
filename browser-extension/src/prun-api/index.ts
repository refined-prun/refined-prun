import { listenPrunApi } from '@src/prun-api/prun-api-listener';
import { preloadFioResponses } from '@src/prun-api/fio-api';
import materials from '@src/prun-api/materials';
import systems from '@src/prun-api/systems';
import planets from '@src/prun-api/planets';

export async function initializePrunApi() {
  preloadFioResponses();
  await listenPrunApi();
}

export async function loadGameData() {
  await Promise.allSettled([materials.load(), systems.load(), planets.load()]);
}
