import { getBuildingBuildMaterials, isRepairableBuilding } from '@src/core/buildings';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { getBuildingLastRepair, sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getShipLastRepair } from '@src/infrastructure/prun-api/data/ships';
import { diffDays } from '@src/utils/time-diff';

export interface RepairEntry {
  ticker: string;
  target: string;
  naturalId: string;
  lastRepair: number;
  condition: number;
  materials: PrunApi.MaterialAmount[];
  fullMaterials: PrunApi.MaterialAmount[];
}

export function calculateBuildingEntries(sites?: PrunApi.Site[]) {
  if (!sites) {
    return undefined;
  }
  const entries: RepairEntry[] = [];
  for (const site of sites) {
    const target = getEntityNameFromAddress(site.address)!;
    const naturalId = getEntityNaturalIdFromAddress(site.address)!;
    for (const building of site.platforms.filter(isRepairableBuilding)) {
      entries.push({
        ticker: building.module.reactorTicker,
        target,
        naturalId,
        lastRepair: getBuildingLastRepair(building),
        condition: building.condition,
        materials: building.repairMaterials,
        fullMaterials: getBuildingBuildMaterials(building, site),
      });
    }
  }
  entries.sort((a, b) => a.condition - b.condition);
  return entries;
}

export function calculateShipEntries(ships?: PrunApi.Ship[]) {
  if (!ships) {
    return undefined;
  }
  const entries: RepairEntry[] = [];
  for (const ship of ships) {
    entries.push({
      ticker: ship.name,
      target: ship.name,
      naturalId: 'SHIP',
      lastRepair: getShipLastRepair(ship),
      condition: ship.condition,
      materials: ship.repairMaterials,
      fullMaterials: ship.repairMaterials,
    });
  }
  entries.sort((a, b) => a.condition - b.condition);
  return entries;
}

export function getPlanetRepairAge(siteId: string, now: number) {
  const site = sitesStore.getById(siteId);
  if (!site) {
    return undefined;
  }
  const buildings = site.platforms.filter(isRepairableBuilding);
  if (buildings.length === 0) {
    return undefined;
  }
  let maxAge = 0;
  for (const building of buildings) {
    const age = diffDays(getBuildingLastRepair(building), now, true);
    if (age > maxAge) {
      maxAge = age;
    }
  }
  return maxAge;
}
