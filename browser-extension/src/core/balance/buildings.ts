import { sumMaterialAmountPrice } from '@src/infrastructure/fio/cx';
import { getBuildingLastRepair, sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { sumMapValues } from '@src/core/balance/utils';
import { getPlanetNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { timestampEachMinute } from '@src/utils/dayjs';
import { calculateBuildingCondition } from '@src/core/buildings';
import { computed } from 'vue';
import { diffDays } from '@src/utils/time-diff';

interface Entry {
  location: string;
  building: PrunApi.Platform;
  value: number;
}

const buildingValue = computed(() => {
  const buildings: Entry[] = [];
  for (const site of sitesStore.all.value) {
    const location = getPlanetNameFromAddress(site.address)!;
    for (const building of site.platforms) {
      const value =
        sumMaterialAmountPrice(building.reclaimableMaterials) +
        sumMaterialAmountPrice(building.repairMaterials);
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
  const now = timestampEachMinute();
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
