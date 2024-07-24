import prun from '@src/prun-api/prun';

export function preloadFioResponses() {
  loadAllPlanets();
}

async function loadAllPlanets() {
  const response = await fetch('https://rest.fnar.net/planet/allplanets');
  const json = (await response.json()) as FioApi.AllPlanetsShort;
  prun.planets.applyFioResponse(json);
}
