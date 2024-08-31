import { computed } from 'vue';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { sumMaterialAmountPrice } from '@src/infrastructure/fio/cx';
import { blueprintsStore } from '@src/infrastructure/prun-api/data/blueprints';
import { accumulatedHQUpgrades, maxHQLevel } from '@src/core/hq';
import { clamp } from '@src/utils/clamp';
import { shipyardProjectsStore } from '@src/infrastructure/prun-api/data/shipyard-projects';

const ships = computed(() => {
  let total = 0;
  for (const ship of shipsStore.all.value) {
    const blueprint = blueprintsStore.getByNaturalId(ship.blueprintNaturalId);
    if (!blueprint) {
      continue;
    }

    const shipValue = sumMaterialAmountPrice(blueprint.billOfMaterial.quantities);
    const repairsCost = sumMaterialAmountPrice(ship.repairMaterials);
    total += shipValue - repairsCost;
  }
  for (const project of shipyardProjectsStore.all.value.filter(x => x.status === 'IN_PROGRESS')) {
    total += sumMaterialAmountPrice(project.inventory.items);
  }
  return total;
});

const hqLevelValue = computed(() => {
  return clamp(companyStore.headquarters.level, 0, maxHQLevel);
});

const hqUpgrades = computed(() => {
  let value = sumMaterialAmountPrice(accumulatedHQUpgrades.value[hqLevelValue.value]);
  value += sumMaterialAmountPrice(companyStore.headquarters.inventory.items);
  return value;
});

const apexRepresentationCenter = computed(
  () => companyStore.representation.contributedTotal.amount,
);

const total = computed(() => {
  return ships.value + hqUpgrades.value + hqUpgrades.value + apexRepresentationCenter.value;
});

export const lockedAssets = {
  ships,
  hqUpgrades,
  apexRepresentationCenter,
  total,
};
