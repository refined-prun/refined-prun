import { loadFallbackFioResponse } from '@src/prun-api/fallback-files';
import { planetsStore } from '@src/prun-api/data/planets';
import { dispatch } from '@src/prun-api/data/api-messages';

export function preloadFioResponses() {
  loadAllPlanets();
}

async function loadAllPlanets() {
  const response = await fetch('https://rest.fnar.net/planet/allplanets');
  const json = (await response.json()) as FioApi.AllPlanetsShort;
  dispatchFioResponse(json);
}

export async function loadFallbackPlanetData() {
  const fallbackResponse = await loadFallbackFioResponse<FioApi.AllPlanetsShort>('allplanets');
  if (planetsStore.fetched.value) {
    return;
  }

  dispatchFioResponse(fallbackResponse);
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
