import { getBuildingLastRepair } from '@src/infrastructure/prun-api/data/sites';
import { isRepairableBuilding } from '@src/core/buildings';
import type { MaterialBill } from '@src/features/XIT/ACT/shared-types';

// Compute the site's repair bill from age threshold and advance days.
// Keep synchronous for reactive use in Configure and other features.
export function computeRepairBill(
  site: PrunApi.Site,
  thresholdDays: number,
  advanceDays: number,
): MaterialBill {
  const parsedGroup: MaterialBill = {};
  for (const building of site.platforms) {
    if (!isRepairableBuilding(building)) {
      continue;
    }

    const lastRepair = getBuildingLastRepair(building);
    const date = (new Date().getTime() - lastRepair) / 86400000;

    if (date + advanceDays < thresholdDays) {
      continue;
    }

    const buildingMaterials = {};
    for (const mat of building.reclaimableMaterials) {
      const amount = mat.amount;
      const ticker = mat.material.ticker;
      if (buildingMaterials[ticker]) {
        buildingMaterials[ticker] += amount;
      } else {
        buildingMaterials[ticker] = amount;
      }
    }
    for (const mat of building.repairMaterials) {
      const amount = mat.amount;
      const ticker = mat.material.ticker;
      if (buildingMaterials[ticker]) {
        buildingMaterials[ticker] += amount;
      } else {
        buildingMaterials[ticker] = amount;
      }
    }

    const adjustedDate = date + advanceDays;
    for (const ticker of Object.keys(buildingMaterials)) {
      const amount =
        // This isn't quite right but will be off by only 1 MCG at most
        adjustedDate > 180
          ? buildingMaterials[ticker]
          : Math.ceil((buildingMaterials[ticker] * adjustedDate) / 180);

      if (parsedGroup[ticker] !== undefined) {
        parsedGroup[ticker].quantity += amount;
      } else {
        parsedGroup[ticker] = { quantity: amount };
      }
    }
  }
  return parsedGroup;
}
