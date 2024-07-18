import planets from '@src/prun-api/planets';

export function preloadFioResponses() {
  loadAllPlanets();
}

async function loadAllPlanets() {
  const response = await fetch('https://rest.fnar.net/planet/allplanets');
  const json = (await response.json()) as FioApi.AllPlanetsShort;
  planets.applyFioResponse(json);
}
