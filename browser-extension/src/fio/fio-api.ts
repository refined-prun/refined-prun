import prun from '@src/prun-api/prun';
import { loadFallbackFioResponse } from '@src/prun-api/fallback-files';
import { store } from '@src/prun-api/data/store';

export function preloadFioResponses() {
  loadAllPlanets();
}

async function loadAllPlanets() {
  const response = await fetch('https://rest.fnar.net/planet/allplanets');
  const json = (await response.json()) as FioApi.AllPlanetsShort;
  prun.planets.applyFioResponse(json);
  dispatch(json);
}

export async function loadFallbackPlanetData() {
  const fallbackResponse = await loadFallbackFioResponse<FioApi.AllPlanetsShort>('allplanets');
  if (store.getState().planets.fetched) {
    return;
  }

  dispatch(fallbackResponse);
}

function dispatch(response: FioApi.AllPlanetsShort) {
  store.dispatch({
    type: 'FIO_PLANET_DATA',
    data: {
      planets: response.map(x => ({
        naturalId: x.PlanetNaturalId,
        name: x.PlanetName,
      })),
    },
  });
}
