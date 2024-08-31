import { computed } from 'vue';
import { sumMaterialAmountPrice } from '@src/infrastructure/fio/cx';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import {
  partnerNonCurrentConditions,
  selfNonCurrentConditions,
  sumAccountsPayable,
  sumLoanInstallments,
  sumDeliveries,
  sumMaterialsShipment,
  sumMaterialsPickup,
} from '@src/core/balance/contract-conditions';
import { sumMapValues } from '@src/core/balance/utils';
import { getPlanetNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';

type AddressableId = string;

const buildings = computed(() => {
  const buildings = new Map<AddressableId, number>();
  // Buildings
  for (const site of sitesStore.all.value) {
    let value = 0;
    for (const building of site.platforms) {
      value += sumMaterialAmountPrice(building.reclaimableMaterials);
    }
    if (value === 0) {
      continue;
    }

    const name = getPlanetNameFromAddress(site.address)!;
    buildings.set(name, (buildings.get(name) ?? 0) + value);
  }
  return buildings;
});

const buildingsTotal = computed(() => sumMapValues(buildings.value));

const bases = computed(() => 1);

const accountsReceivable = computed(() => sumAccountsPayable(partnerNonCurrentConditions));

const longTermLoans = computed(() => sumLoanInstallments(partnerNonCurrentConditions));

const materialsToReceive = computed(
  () =>
    sumDeliveries(partnerNonCurrentConditions) +
    sumMaterialsShipment(partnerNonCurrentConditions) +
    sumMaterialsPickup(selfNonCurrentConditions),
);

const total = computed(() => {
  return (
    buildingsTotal.value +
    bases.value +
    accountsReceivable.value +
    materialsToReceive.value +
    longTermLoans.value
  );
});

export const nonCurrentAssets = {
  buildings,
  buildingsTotal,
  bases,
  accountsReceivable,
  materialsToReceive,
  longTermLoans,
  total,
};
