import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { dispatch } from '@src/infrastructure/prun-api/data/api-messages';
import { loadLocalJson } from '@src/util';

export function preloadFioResponses() {
  loadAllPlanets();
}

async function loadAllPlanets() {
  const response = await fetch('https://rest.fnar.net/planet/allplanets');
  const json = (await response.json()) as FioApi.AllPlanetsShort;
  dispatchFioResponse(json);
}

export async function loadFallbackPlanetData() {
  const fallbackResponse = await loadFallbackResponse<FioApi.AllPlanetsShort>('allplanets');
  if (planetsStore.fetched.value) {
    return;
  }

  dispatchFioResponse(fallbackResponse);
}

async function loadFallbackResponse<T>(name: string) {
  return (await loadLocalJson(`fallback-fio-responses/${name}.json`)) as T;
}

function dispatchFioResponse(response: FioApi.AllPlanetsShort) {
  dispatch({
    type: 'FIO_PLANET_DATA',
    data: {
      planets: response.map(x => ({
        naturalId: x.PlanetNaturalId,
        name: x.PlanetName,
      })),
    },
  });
}
