import { computed } from 'vue';
import { getPrice } from '@src/fio/cx';
import { sitesStore } from '@src/prun-api/data/sites';
import {
  partnerNonCurrentConditions,
  sumAccountsPayable,
  sumLoanInstallments,
  sumMaterialsPayable,
} from '@src/core/balance/contract-conditions';
import { sumMapValues } from '@src/core/balance/utils';
import { getPlanetNameFromAddress } from '@src/prun-api/data/addresses';

type AddressableId = string;

const buildings = computed(() => {
  const buildings = new Map<AddressableId, number>();
  // Buildings
  for (const site of sitesStore.all.value) {
    let value = 0;
    for (const building of site.platforms) {
      for (const mat of building.reclaimableMaterials) {
        value += getPrice(mat.material.ticker) * mat.amount;
      }
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

const materialsReceivable = computed(() => sumMaterialsPayable(partnerNonCurrentConditions));

const total = computed(() => {
  return (
    buildingsTotal.value +
    bases.value +
    accountsReceivable.value +
    materialsReceivable.value +
    longTermLoans.value
  );
});

export const nonCurrentAssets = {
  buildings,
  buildingsTotal,
  bases,
  accountsReceivable,
  materialsReceivable,
  longTermLoans,
  total,
};
