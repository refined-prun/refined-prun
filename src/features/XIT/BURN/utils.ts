import { BurnValues, PlanetBurn } from '@src/core/burn';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { sortMaterials } from '@src/core/sort-materials';
import { userData } from '@src/store/user-data';

// Days at the precision shown: whole from 10 up, one decimal below. Truncated, not rounded.
export function displayedDays(days: number) {
  return days >= 10 ? Math.floor(days) : Math.trunc(days * 10) / 10;
}

// Shared classification so the cell color and filter buttons always match.
// Mutually exclusive: red ≤ R < yellow ≤ Y < green.
export interface BurnThresholds {
  isRed: boolean;
  isYellow: boolean;
  isGreen: boolean;
}

export function getBurnThresholds(days: number): BurnThresholds {
  const shownDays = displayedDays(days);
  const isRed = shownDays <= userData.settings.burn.red;
  const isYellow = !isRed && shownDays <= userData.settings.burn.yellow;
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
