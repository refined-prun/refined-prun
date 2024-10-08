import { computed } from 'vue';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { sumMaterialAmountPrice } from '@src/infrastructure/fio/cx';
import { blueprintsStore } from '@src/infrastructure/prun-api/data/blueprints';
import { accumulatedHQUpgrades, maxHQLevel } from '@src/core/hq';
import { clamp } from '@src/utils/clamp';
import { shipyardProjectsStore } from '@src/infrastructure/prun-api/data/shipyard-projects';
import { sum } from '@src/utils/sum';
import { map } from '@src/utils/map-values';
import { sumBy } from '@src/utils/sum-by';

const builtShips = computed(() => {
  blueprintsStore.request();
  return sumBy(shipsStore.all.value, calculateShipValue);
});

function calculateShipValue(ship: PrunApi.Ship) {
  const blueprint = blueprintsStore.getByNaturalId(ship.blueprintNaturalId);
  return sumMaterialAmountPrice(blueprint?.billOfMaterial.quantities);
}

const startedShips = computed(() =>
  sumBy(
    shipyardProjectsStore.all.value?.filter(x => x.status === 'STARTED'),
    x => sumMaterialAmountPrice(x.inventory.items),
  ),
);

const shipsMarketValue = computed(() => sum(builtShips.value, startedShips.value));

const shipsDepreciation = computed(() => {
  return sumBy(shipsStore.all.value, x => sumMaterialAmountPrice(x.repairMaterials));
});

const hqLevel = computed(() =>
  map([companyStore.value], x => clamp(x.headquarters.level, 0, maxHQLevel)),
);

const hqBuiltLevels = computed(() =>
  map([hqLevel.value], x => sumMaterialAmountPrice(accumulatedHQUpgrades.value[x])),
);

const hqAssignedItems = computed(() =>
  map([companyStore.value], x => sumMaterialAmountPrice(x.headquarters.inventory.items)),
);

const hqUpgrades = computed(() => map([hqBuiltLevels.value, hqAssignedItems.value], sum));

const arc = computed(() => companyStore.value?.representation.contributedTotal.amount);

export const lockedAssets = {
  shipsMarketValue,
  shipsDepreciation,
  hqUpgrades,
  arc,
};
