import { computed } from 'vue';
import { companyStore } from '@src/prun-api/data/company';
import { shipsStore } from '@src/prun-api/data/ships';
import { getPrice } from '@src/fio/cx';
import { blueprintsStore } from '@src/prun-api/data/blueprints';
import { accumulatedHqUpgrades, hqUpgradeMaterials } from '@src/core/hq';
import { sumItemsValue } from '@src/core/balance/utils';

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

  return total;
});

const hqLevelValue = computed(() => {
  return Math.min(companyStore.headquarters.level, hqUpgradeMaterials.length - 1);
});

const hqLevel = computed(() => {
  let value = 0;
  for (const [amount, ticker] of accumulatedHqUpgrades[hqLevelValue.value]) {
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
