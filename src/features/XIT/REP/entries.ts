import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { isEmpty } from 'ts-extras';

export { calculateBuildingEntries, calculateShipEntries } from '@src/core/repair';
export type { RepairEntry } from '@src/core/repair';

export function getParameterSites(parameters: string[]) {
  let sites: PrunApi.Site[] = [];
  if (isEmpty(parameters)) {
    if (sitesStore.all.value === undefined) {
      return undefined;
    }
    sites = sitesStore.all.value;
  }
  for (let i = 0; i < parameters.length; i++) {
    const site = sitesStore.getByPlanetNaturalIdOrName(parameters[i]);
    if (site) {
      sites.push(site);
    }
  }
  return sites;
}

export function getParameterShips(parameters: string[]) {
  let ships: PrunApi.Ship[] = [];
  if (parameters.length === 0 || parameters.some(isShipParameter)) {
    if (shipsStore.all.value === undefined) {
      return undefined;
    }
    ships = shipsStore.all.value;
  }
  return ships;
}

function isShipParameter(parameter: string) {
  const upper = parameter.toUpperCase();
  return upper === 'SHIP' || upper === 'SHIPS';
}
