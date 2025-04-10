import { act } from '@src/features/XIT/ACT/act-registry';
import Edit from '@src/features/XIT/ACT/material-groups/repair/Edit.vue';
import { getBuildingLastRepair, sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { isRepairableBuilding } from '@src/core/buildings';

act.addMaterialGroup({
  type: 'Repair',
  description: group => {
    if (!group.planet) {
      return '--';
    }

    const days = group.days;
    const daysPart = days ? `older than ${days} day${days == 1 ? '' : 's'}` : '';
    const advanceDays = group.advanceDays || 0;
    return `Repair buildings on ${group.planet} ${daysPart} in ${advanceDays} day${advanceDays == 1 ? '' : 's'}`;
  },
  editComponent: Edit,
  generateMaterialBill: async ({ data, log }) => {
    const planet = data.planet;
    if (!planet) {
      log.error('Missing resupply planet');
      return undefined;
    }

    const planetSite = sitesStore.getByPlanetNaturalIdOrName(planet);
    if (!planetSite?.platforms) {
      log.error('Missing data on repair planet');
      return undefined;
    }

    const days = typeof data.days === 'number' ? data.days : parseFloat(data.days!);
    let advanceDays =
      typeof data.advanceDays === 'number' ? data.advanceDays : parseFloat(data.advanceDays!);
    const threshold = isNaN(days) ? 0 : days;
    advanceDays = isNaN(advanceDays) ? 0 : advanceDays;

    const parsedGroup = {};
    for (const building of planetSite.platforms) {
      if (!isRepairableBuilding(building)) {
        continue;
      }

      const lastRepair = getBuildingLastRepair(building);
      const date = (new Date().getTime() - lastRepair) / 86400000;

      if (date + advanceDays < threshold) {
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
          adjustedDate > 180
            ? buildingMaterials[ticker]
            : // This isn't quite right, but will be off by only 1 MCG at most
              Math.ceil((buildingMaterials[ticker] * adjustedDate) / 180);

        if (parsedGroup[ticker]) {
          parsedGroup[ticker] += amount;
        } else {
          parsedGroup[ticker] = amount;
        }
      }
    }
    return parsedGroup;
  },
});
