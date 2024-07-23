import { loadFallbackFioResponse } from '@src/prun-api/fallback-files';

export interface Planet {
  naturalId: string;
  name: string;
}

let loaded = false;

const planetsByNaturalId: Map<string, Planet> = new Map();
const planetsByName: Map<string, Planet> = new Map();

function applyFioResponse(response: FioApi.AllPlanetsShort) {
  if (response.length === 0) {
    return;
  }

  planetsByNaturalId.clear();
  planetsByName.clear();

  for (const apiPlanet of response) {
    const planet: Planet = {
      naturalId: apiPlanet.PlanetNaturalId,
      name: apiPlanet.PlanetName,
    };
    planetsByNaturalId.set(planet.naturalId.toLowerCase(), planet);
    planetsByName.set(planet.name.toLowerCase(), planet);
  }

  loaded = true;
}

async function load() {
  if (loaded) {
    return;
  }

  const fallbackPacket = await loadFallbackFioResponse<FioApi.AllPlanetsShort>('allplanets');
  if (loaded) {
    return;
  }

  applyFioResponse(fallbackPacket);
}

function getByNaturalId(naturalId?: string | null) {
  return naturalId ? planetsByNaturalId.get(naturalId.toLowerCase()) : undefined;
}

function getByName(name?: string | null) {
  return name ? planetsByName.get(name.toLowerCase()) : undefined;
}

const planets = {
  applyFioResponse,
  load,
  get: getByNaturalId,
  getByName,
};

export default planets;
