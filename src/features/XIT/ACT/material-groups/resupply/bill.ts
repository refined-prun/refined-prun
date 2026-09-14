import { calculatePlanetBurn } from '@src/core/burn';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import type { MaterialFilter } from './config';
import type { MaterialBill } from '@src/features/XIT/ACT/shared-types';

// Compute the planet's resupply bill for a day count; return undefined if inputs or burn data
// are missing. Keep synchronous for reactive use in Configure.
export function computeResupplyBill(
  data: UserData.MaterialGroupData,
  planet: string | undefined,
  days: number | undefined,
  materialFilter?: MaterialFilter,
): MaterialBill | undefined {
  if (!planet || days === undefined || isNaN(days)) {
    return undefined;
  }
  const site = sitesStore.getByPlanetNaturalIdOrName(planet);
  if (!site) {
    return undefined;
  }
  const workforce = workforcesStore.getById(site.siteId)?.workforces;
  const production = productionStore.getBySiteId(site.siteId);
  if (workforce === undefined || production === undefined) {
    return undefined;
  }
  const stores = storagesStore.getByAddressableId(site.siteId);

  const filter =
    materialFilter ?? data.materialFilter ?? (data.consumablesOnly ? 'Workforce' : 'All');
  const planetBurn = calculatePlanetBurn(
    production,
    workforce,
    (data.useBaseInv ?? true) ? stores : undefined,
  );

  const exclusions = data.exclusions ?? [];
  const bill: MaterialBill = {};
  for (const ticker of Object.keys(planetBurn)) {
    if (exclusions.includes(ticker)) {
      continue;
    }
    const matBurn = planetBurn[ticker];
    // Filter by primary demand type, but keep full dailyAmount for materials with mixed demand.
    if (filter === 'Workforce' && matBurn.workforce === 0) {
      continue;
    }
    if (filter === 'Production' && matBurn.input === 0) {
      continue;
    }
    if (matBurn.dailyAmount >= 0) {
      continue;
    }
    const consumed = days * -matBurn.dailyAmount;
    const need = Math.max(0, Math.ceil(consumed - matBurn.inventory + 1));
    if (need > 0) {
      bill[ticker] = { quantity: need };
    }
  }
  return bill;
}
