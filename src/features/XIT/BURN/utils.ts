import {
  computeNeed,
  getMinDaysLeft,
  getResupplyDays,
  MaterialBurn,
  PlanetBurn,
} from '@src/core/burn';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { sortMaterials } from '@src/core/sort-materials';
import { trunc0, trunc01 } from '@src/utils/format';
import { userData } from '@src/store/user-data';

export type BurnSortKey = 'inv' | 'burn' | 'need' | 'days';

// Default direction when a column is first clicked.
export const burnSortNaturalDesc: Record<BurnSortKey, boolean> = {
  inv: false,
  burn: false,
  need: true,
  days: false,
};

function getSortValue(mat: MaterialBurn, key: BurnSortKey, naturalId: string) {
  switch (key) {
    case 'inv':
      return mat.inventory + mat.inboundInventory + mat.remainingAllocation;
    case 'burn':
      return mat.dailyAmount;
    case 'need': {
      const need = computeNeed(mat, getResupplyDays(naturalId || undefined));
      return isNaN(need) ? 0 : need;
    }
    case 'days':
      return mat.dailyAmount >= 0 ? Number.POSITIVE_INFINITY : mat.daysLeft;
  }
}

export function getSortedTickers(burn: PlanetBurn, sortBy?: string, sortDesc?: boolean) {
  const materials = Object.keys(burn.burn).map(materialsStore.getByTicker);
  const sorted = sortMaterials(materials.filter(x => x !== undefined));
  if (!sortBy || !(sortBy in burnSortNaturalDesc)) {
    return sorted;
  }
  const key = sortBy as BurnSortKey;
  const dir = sortDesc ? -1 : 1;
  // Array.prototype.sort is stable: ties keep the default material order.
  return sorted.slice().sort((a, b) => {
    const x = getSortValue(burn.burn[a.ticker], key, burn.naturalId);
    const y = getSortValue(burn.burn[b.ticker], key, burn.naturalId);
    if (x === y) {
      return 0;
    }
    return (x < y ? -1 : 1) * dir;
  });
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
