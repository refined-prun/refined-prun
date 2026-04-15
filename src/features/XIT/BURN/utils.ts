import { BurnValues, MaterialBurn, PlanetBurn } from '@src/core/burn';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { sortMaterials } from '@src/core/sort-materials';

export function getSortedTickers(burn: PlanetBurn) {
  const materials = Object.keys(burn.burn).map(materialsStore.getByTicker);
  return sortMaterials(materials.filter(x => x !== undefined));
}

export function countDays(burn: BurnValues) {
  let days = 1000;
  for (const key of Object.keys(burn)) {
    const mat = burn[key];
    if (!isNaN(mat.dailyAmount) && mat.dailyAmount < 0 && mat.daysLeft < days) {
      days = mat.daysLeft;
    }
  }
  return days;
}

export function computeNeed(mat: MaterialBurn, resupplyDays: number) {
  const production = mat.dailyAmount;
  const isInf = production >= 0;
  const days = isInf ? 1000 : mat.daysLeft;
  if (days > resupplyDays || production > 0) {
    return 0;
  }
  const need = Math.ceil((days - resupplyDays) * production);
  // This check is needed to prevent a "-0" value that can happen
  // in situations like: 0 * -0.25 => -0.
  return need === 0 ? 0 : need;
}
