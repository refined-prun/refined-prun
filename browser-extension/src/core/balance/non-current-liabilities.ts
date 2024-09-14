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

const total = computed(() => {
  return accountsPayable.value + materialsToDeliver.value + longTermDebt.value;
});

export const nonCurrentLiabilities = {
  accountsPayable,
  materialsToDeliver,
  longTermDebt,
  total,
};
