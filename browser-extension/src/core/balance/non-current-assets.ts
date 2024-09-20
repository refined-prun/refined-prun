import { computed } from 'vue';
import {
  partnerNonCurrentConditions,
  selfNonCurrentConditions,
  sumAccountsPayable,
  sumLoanRepayments,
  sumDeliveries,
  sumMaterialsShipment,
  sumMaterialsPickup,
} from '@src/core/balance/contract-conditions';
import { buildingsTotal, currentBuildingValue } from '@src/core/balance/buildings';
import { sum } from '@src/utils/sum';

const accountsReceivable = computed(() => sumAccountsPayable(partnerNonCurrentConditions));

const longTermLoans = computed(() => sumLoanRepayments(partnerNonCurrentConditions));

const materialsToReceive = computed(() =>
  sum(
    sumDeliveries(partnerNonCurrentConditions),
    sumMaterialsShipment(partnerNonCurrentConditions),
    sumMaterialsPickup(selfNonCurrentConditions),
  ),
);

export const nonCurrentAssets = {
  buildings: currentBuildingValue,
  buildingsTotal,
  accountsReceivable,
  materialsToReceive,
  longTermLoans,
};
