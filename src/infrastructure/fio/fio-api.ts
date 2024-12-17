import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { dispatch } from '@src/infrastructure/prun-api/data/api-messages';

export function preloadFioResponses() {
  void loadAllPlanets();
}

async function loadAllPlanets() {
  const response = await fetch('https://rest.fnar.net/planet/allplanets');
  const json = (await response.json()) as FioApi.AllPlanetsShort;
  dispatchFioResponse(json);
}

export async function loadFallbackPlanetData() {
  const fallbackFile = await fetch(config.url.allplanets);
  const fallbackResponse = (await fallbackFile.json()) as FioApi.AllPlanetsShort;
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
