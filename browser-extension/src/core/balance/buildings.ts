import { sumMaterialAmountPrice } from '@src/infrastructure/fio/cx';
import { getBuildingLastRepair, sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { sumMapValues } from '@src/core/balance/utils';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { timestampEachMinute } from '@src/utils/dayjs';
import { calculateBuildingCondition } from '@src/core/buildings';
import { computed } from 'vue';
import { diffDays } from '@src/utils/time-diff';
import { sum } from '@src/utils/sum';

interface Entry {
  location: string;
  building: PrunApi.Platform;
  value: number;
}

const buildingValue = computed(() => {
  const sites = sitesStore.all.value;
  if (sites === undefined) {
    return undefined;
  }
  const buildings: Entry[] = [];
  for (const site of sites) {
    const location = getEntityNameFromAddress(site.address)!;
    for (const building of site.platforms) {
      const value = sum(
        sumMaterialAmountPrice(building.reclaimableMaterials),
        sumMaterialAmountPrice(building.repairMaterials),
      );
      if (value === undefined) {
        return undefined;
      }
      buildings.push({
        location,
        building,
        value,
      });
    }
  }
  return buildings;
});

export const currentBuildingValue = computed(() => {
  if (buildingValue.value == undefined) {
    return undefined;
  }

  const now = timestampEachMinute.value;
  const buildings = new Map<string, number>();
  for (const building of buildingValue.value) {
    const lastRepair = getBuildingLastRepair(building.building);
    const age = diffDays(lastRepair, now, true);
    const value = building.value * calculateBuildingCondition(age);
    buildings.set(building.location, (buildings.get(building.location) ?? 0) + value);
  }
  return buildings;
});

export const buildingsTotal = computed(() => sumMapValues(currentBuildingValue.value));
