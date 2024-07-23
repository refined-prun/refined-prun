import { loadFallbackPacket } from '@src/prun-api/fallback-files';
import ApiPayload = PrunApi.SYSTEM_STARS_DATA.Payload;
import { Planet } from '@src/prun-api/planets';

interface System {
  id: string;
  naturalId: string;
  name: string;
  connections: System[];
}

let loaded = false;

const systemsById: Map<string, System> = new Map();
const systemsByNaturalId: Map<string, System> = new Map();
const systemsByName: Map<string, System> = new Map();

function applyApiPayload(payload: ApiPayload) {
  systemsById.clear();
  systemsByNaturalId.clear();
  systemsByName.clear();

  for (const apiStar of payload.stars) {
    const system: System = {
      id: apiStar.systemId,
      naturalId: apiStar.address.lines[0].entity.naturalId,
      name: apiStar.name,
      connections: [],
    };
    systemsById.set(system.id.toLowerCase(), system);
    systemsByNaturalId.set(system.naturalId.toLowerCase(), system);
    systemsByName.set(system.name.toLowerCase(), system);
  }

  for (const apiStar of payload.stars) {
    const system: System = systemsById.get(apiStar.systemId)!;
    for (const connection of apiStar.connections) {
      system.connections.push(systemsById[connection]);
    }
  }

  loaded = true;
}

async function load() {
  if (loaded) {
    return;
  }

  const fallbackPacket = await loadFallbackPacket<ApiPayload>('SYSTEM_STARS_DATA');
  if (loaded) {
    return;
  }

  applyApiPayload(fallbackPacket);
}

function get(naturalIdOrName?: string | null) {
  return getByNaturalId(naturalIdOrName) ?? getByName(naturalIdOrName);
}

function getByNaturalId(naturalId?: string | null) {
  return naturalId ? systemsByNaturalId.get(naturalId.toLowerCase()) : undefined;
}

function getByName(name?: string | null) {
  return name ? systemsByName.get(name.toLowerCase()) : undefined;
}

function getByPlanet(planet?: Planet | null) {
  return getByNaturalId(planet?.naturalId.slice(0, -1));
}

const systems = {
  applyApiPayload,
  load,
  get,
  getByNaturalId,
  getByName,
  getByPlanet,
};

export default systems;
