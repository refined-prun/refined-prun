import { getMinDaysLeft, PlanetBurn } from '@src/core/burn';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { sortMaterials } from '@src/core/sort-materials';
import { trunc0, trunc01 } from '@src/utils/format';
import { userData } from '@src/store/user-data';

export function getSortedTickers(burn: PlanetBurn) {
  const materials = Object.keys(burn.burn).map(materialsStore.getByTicker);
  return sortMaterials(materials.filter(x => x !== undefined));
}

export const countDays = getMinDaysLeft;

export function formatBurnDays(days: number) {
  if (days > 999) {
    return '∞';
  }
  if (days >= 10) {
    return trunc0(days);
  }
  return trunc01(days);
}

export function getBurnThresholds(days: number) {
  const isRed = days <= userData.settings.burn.red;
  const isYellow = !isRed && days <= userData.settings.burn.yellow;
  return {
    isRed,
    isYellow,
    isGreen: !isRed && !isYellow,
  };
}

export function burnDaysClass(days: number) {
  const { isRed, isYellow, isGreen } = getBurnThresholds(days);
  return {
    [C.Workforces.daysMissing]: isRed,
    [C.Workforces.daysWarning]: isYellow,
    [C.Workforces.daysSupplied]: isGreen,
  };
}
