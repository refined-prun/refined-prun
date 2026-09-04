import { BurnValues, PlanetBurn } from '@src/core/burn';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { sortMaterials } from '@src/core/sort-materials';
import { userData } from '@src/store/user-data';

// Shared classification so the cell color and filter buttons always match.
// Classifies the true value against the integer thresholds, not the truncated
// display, so a 10.9 that displays "10" still counts as above a 10-day
// threshold. Mutually exclusive: red ≤ R < yellow ≤ Y < green.
export function getBurnThresholds(days: number) {
  const isRed = days <= userData.settings.burn.red;
  const isYellow = !isRed && days <= userData.settings.burn.yellow;
  return {
    isRed,
    isYellow,
    isGreen: !isRed && !isYellow,
  };
}

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
