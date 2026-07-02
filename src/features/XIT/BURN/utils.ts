import { BurnValues, PlanetBurn } from '@src/core/burn';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { sortMaterials } from '@src/core/sort-materials';
import { userData } from '@src/store/user-data';

// Shared red/yellow/green classification for the cell color (DaysCell) and the
// color filter buttons (MaterialRow), so they always match. Days are floored to
// match the display; categories are cumulative (red implies yellow).
export interface BurnThresholds {
  isRed: boolean;
  isYellow: boolean;
  isGreen: boolean;
}

export function getBurnThresholds(days: number): BurnThresholds {
  const flooredDays = Math.floor(days);
  return {
    isRed: flooredDays <= userData.settings.burn.red,
    isYellow: flooredDays <= userData.settings.burn.yellow,
    isGreen: flooredDays > userData.settings.burn.yellow,
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
