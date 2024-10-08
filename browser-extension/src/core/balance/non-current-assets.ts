import { computed } from 'vue';
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

const accountsReceivable = computed(() => sumAccountsPayable(partnerNonCurrentConditions));

const longTermLoans = computed(() => sumLoanRepayments(partnerNonCurrentConditions));

const materialsInTransit = computed(() => sumShipmentDeliveries(partnerNonCurrentConditions));

const materialsReceivable = computed(() =>
  sum(
    sumDeliveries(partnerNonCurrentConditions),
    sumShipmentDeliveries(partnerNonCurrentConditions),
    sumMaterialsPickup(selfNonCurrentConditions),
  ),
);

export const nonCurrentAssets = {
  buildings,
  buildingsNetValueByLocation,
  accountsReceivable,
  materialsInTransit,
  materialsReceivable,
  longTermLoans,
};
