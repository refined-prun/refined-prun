import {
  partnerNonCurrentConditions,
  selfNonCurrentConditions,
  sumAccountsPayable,
  sumLoanRepayments,
  sumDeliveries,
  sumShipmentDeliveries,
  sumMaterialsPickup,
} from '@src/core/balance/contract-conditions';
import { buildings, buildingsNetValueByLocation } from '@src/core/balance/buildings';
import { sum } from '@src/utils/sum';
import { blueprintsStore } from '@src/infrastructure/prun-api/data/blueprints';
import { sumBy } from '@src/utils/sum-by';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { sumMaterialAmountPrice } from '@src/infrastructure/fio/cx';
import { shipyardProjectsStore } from '@src/infrastructure/prun-api/data/shipyard-projects';
import { map } from '@src/utils/map-values';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { calculateHQUpgradeMaterials } from '@src/core/hq';

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

const hqLevel = computed(() => map([companyStore.value], x => x.headquarters.level));

const hqBuiltLevels = computed(() =>
  map([hqLevel.value], x => sumMaterialAmountPrice(calculateHQUpgradeMaterials(0, x))),
);

const hqAssignedItems = computed(() =>
  map([companyStore.value], x => sumMaterialAmountPrice(x.headquarters.inventory.items)),
);

const hqUpgrades = computed(() => map([hqBuiltLevels.value, hqAssignedItems.value], sum));

const arc = computed(() => companyStore.value?.representation.contributedTotal.amount);

const accountsReceivable = computed(() => sumAccountsPayable(partnerNonCurrentConditions));

const longTermLoans = computed(() => sumLoanRepayments(partnerNonCurrentConditions));

const materialsInTransit = computed(() => sumShipmentDeliveries(partnerNonCurrentConditions));

const materialsReceivable = computed(() =>
  sum(sumDeliveries(partnerNonCurrentConditions), sumMaterialsPickup(selfNonCurrentConditions)),
);

export const nonCurrentAssets = {
  buildings,
  buildingsNetValueByLocation,
  shipsMarketValue,
  shipsDepreciation,
  accountsReceivable,
  materialsInTransit,
  materialsReceivable,
  longTermLoans,
  hqUpgrades,
  arc,
};
