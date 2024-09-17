import { computed } from 'vue';
import {
  selfNonCurrentConditions,
  sumAccountsPayable,
  sumLoanRepayments,
  sumDeliveries,
  sumProvisions,
  sumFactionProvisions,
} from '@src/core/balance/contract-conditions';

const accountsPayable = computed(() => sumAccountsPayable(selfNonCurrentConditions));

const materialsToDeliver = computed(
  () =>
    sumDeliveries(selfNonCurrentConditions) +
    sumProvisions(selfNonCurrentConditions) +
    sumFactionProvisions(selfNonCurrentConditions),
);

const longTermDebt = computed(() => sumLoanRepayments(selfNonCurrentConditions));

export const nonCurrentLiabilities = {
  accountsPayable,
  materialsToDeliver,
  longTermDebt,
};
