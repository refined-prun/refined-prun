import { computed } from 'vue';
import {
  partnerNonCurrentConditions,
  selfNonCurrentConditions,
  sumAccountsPayable,
  sumLoanInstallments,
  sumDeliveries,
  sumMaterialsShipment,
  sumMaterialsPickup,
} from '@src/core/balance/contract-conditions';
import { buildingsTotal, currentBuildingValue } from '@src/core/balance/buildings';

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
  buildings: currentBuildingValue,
  buildingsTotal,
  bases,
  accountsReceivable,
  materialsToReceive,
  longTermLoans,
  total,
};
