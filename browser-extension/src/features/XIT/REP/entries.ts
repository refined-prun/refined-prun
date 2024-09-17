import MaterialAmount = PrunApi.MaterialAmount;
import { getBuildingLastRepair, sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getShipLastRepair, shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';

import { mergeMaterialAmounts } from '@src/core/sort-materials';

export interface RepairEntry {
  ticker: string;
  target: string;
  lastRepair: number;
  condition: number;
  materials: MaterialAmount[];
  fullMaterials: MaterialAmount[];
}

export function calculateBuildingEntries(parameters: string[]) {
  let sites: PrunApi.Site[] = [];
  if (parameters.length === 1) {
    sites = sitesStore.all.value;
  }
  for (let i = 1; i < parameters.length; i++) {
    const site = sitesStore.getByPlanetNaturalIdOrName(parameters[i]);
    if (site) {
      sites.push(site);
    }
  }
  const entries: RepairEntry[] = [];
  for (const site of sites) {
    const target = getEntityNameFromAddress(site.address)!;
    for (const building of site.platforms.filter(x => x.repairMaterials.length > 0)) {
      entries.push({
        ticker: building.module.reactorTicker,
        target,
        lastRepair: getBuildingLastRepair(building),
        condition: building.condition,
        materials: building.repairMaterials,
        fullMaterials: mergeMaterialAmounts(
          building.repairMaterials.concat(building.reclaimableMaterials),
        ),
      });
    }
  }
  entries.sort((a, b) => a.condition - b.condition);
  return entries;
}

export function calculateShipEntries(parameters: string[]) {
  let ships: PrunApi.Ship[] = [];
  if (parameters.length === 1 || parameters.some(isShipParameter)) {
    ships = shipsStore.all.value;
  }
  const entries: RepairEntry[] = [];
  for (const ship of ships) {
    entries.push({
      ticker: ship.name,
      target: ship.name,
      lastRepair: getShipLastRepair(ship),
      condition: ship.condition,
      materials: ship.repairMaterials,
      fullMaterials: ship.repairMaterials,
    });
  }
  entries.sort((a, b) => a.condition - b.condition);
  return entries;
}

function isShipParameter(parameter: string) {
  const upper = parameter.toUpperCase();
  return upper === 'SHIP' || upper === 'SHIPS';
}
