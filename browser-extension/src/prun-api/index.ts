import { listenPrunApi } from '@src/prun-api/prun-api-listener';
import { preloadFioResponses } from '@src/fio/fio-api';
import prun from '@src/prun-api/prun';
import { loadMaterialNames } from '@src/prun-ui/material-names';
import { loadFallbackPacket } from '@src/prun-api/fallback-files';
import { store } from '@src/prun-api/data/store';

export async function initializePrunApi() {
  preloadFioResponses();
  await listenPrunApi();
}

export async function loadGameData() {
  await Promise.allSettled([loadMaterials(), prun.systems.load(), prun.planets.load(), loadMaterialNames()]);
}

async function loadMaterials() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json = await loadFallbackPacket<any>('WORLD_MATERIAL_CATEGORIES');
  store.dispatch({
    type: json.messageType,
    data: json.payload,
  });
}
