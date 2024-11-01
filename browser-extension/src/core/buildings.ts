import { mergeMaterialAmounts } from '@src/core/sort-materials';
import { sumMaterialAmountPrice } from '@src/infrastructure/fio/cx';

export function calcBuildingCondition(age: number) {
  // This isn't quite right, but will be off by only 1 MCG at most
  return age > 180 ? 0 : 1 - age / 180;
}

export function isRepairableBuilding(building: PrunApi.Platform) {
  return building.module.type === 'RESOURCES' || building.module.type === 'PRODUCTION';
}

export function getBuildingBuildMaterials(building: PrunApi.Platform, site: PrunApi.Site) {
  const buildOption = site.buildOptions.options.find(
    x => x.ticker === building.module.reactorTicker,
  );
  if (buildOption) {
    return buildOption.materials.quantities;
  }

  const materials = building.reclaimableMaterials.concat(building.repairMaterials);
  return mergeMaterialAmounts(materials);
}

export function calcBuildingMarketValue(building: PrunApi.Platform, site: PrunApi.Site) {
  return sumMaterialAmountPrice(getBuildingBuildMaterials(building, site));
}
