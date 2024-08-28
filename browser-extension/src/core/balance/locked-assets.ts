import { computed } from 'vue';
import { companyStore } from '@src/prun-api/data/company';
import { shipsStore } from '@src/prun-api/data/ships';
import { getPrice } from '@src/fio/cx';
import { blueprintsStore } from '@src/prun-api/data/blueprints';
import { accumulatedHQUpgrades, maxHQLevel } from '@src/core/hq';
import { sumItemsValue } from '@src/core/balance/utils';
import { clamp } from '@src/utils/clamp';
import { shipyardProjectsStore } from '@src/prun-api/data/shipyard-projects';

const ships = computed(() => {
  let total = 0;
  for (const ship of shipsStore.all.value) {
    const blueprint = blueprintsStore.getByNaturalId(ship.blueprintNaturalId);
    if (!blueprint) {
      continue;
    }

    let shipValue = 0;
    for (const mat of blueprint.billOfMaterial.quantities) {
      shipValue += getPrice(mat.material.ticker) * mat.amount;
    }

    let repairsCost = 0;
    for (const mat of ship.repairMaterials) {
      repairsCost += getPrice(mat.material.ticker) * mat.amount;
    }

    total += shipValue - repairsCost;
  }
  for (const project of shipyardProjectsStore.all.value.filter(x => x.status === 'IN_PROGRESS')) {
    total += sumItemsValue(project.inventory.items);
  }
  return total;
});

const hqLevelValue = computed(() => {
  return clamp(companyStore.headquarters.level, 0, maxHQLevel);
});

const hqLevel = computed(() => {
  let value = 0;
  for (const [amount, ticker] of accumulatedHQUpgrades[hqLevelValue.value]) {
    value += getPrice(ticker) * amount;
  }
  return value;
});

const hqUpgradeInventory = computed(() => sumItemsValue(companyStore.headquarters.inventory.items));

const apexRepresentationCenter = computed(
  () => companyStore.representation.contributedTotal.amount,
);

const total = computed(() => {
  return ships.value + hqLevel.value + hqUpgradeInventory.value + apexRepresentationCenter.value;
});

export const lockedAssets = {
  ships,
  hqLevel,
  hqUpgradeInventory,
  apexRepresentationCenter,
  total,
};
