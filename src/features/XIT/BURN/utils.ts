import { BurnValues, getMinDaysLeft, PlanetBurn } from '@src/core/burn';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { sortMaterials } from '@src/core/sort-materials';
import { trunc0, trunc01 } from '@src/utils/format';
import { userData } from '@src/store/user-data';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { getDaysAll } from './days-all';

export { getDaysAll };

export function getSortedTickers(burn: PlanetBurn) {
  const materials = Object.keys(burn.burn).map(materialsStore.getByTicker);
  return sortMaterials(materials.filter(x => x !== undefined));
}

export const countDays = getMinDaysLeft;

// Material amounts in the warehouse on the given planet.
export function getWarehouseAmounts(naturalId: string) {
  const amounts: Record<string, number> = {};
  if (!naturalId) {
    return amounts;
  }
  const warehouse = warehousesStore.getByEntityNaturalId(naturalId);
  const store = storagesStore.getById(warehouse?.storeId);
  for (const item of store?.items ?? []) {
    const quantity = item.quantity;
    if (!quantity) {
      continue;
    }
    const ticker = quantity.material.ticker;
    amounts[ticker] = (amounts[ticker] ?? 0) + quantity.amount;
  }
  return amounts;
}

// Days All of the most urgent consumed material.
export function countDaysAll(burn: BurnValues) {
  let days = 1000;
  for (const mat of Object.values(burn)) {
    if (mat.dailyAmount < 0) {
      days = Math.min(days, getDaysAll(mat));
    }
  }
  return days;
}

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
