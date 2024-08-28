import { computed } from 'vue';
import {
  selfNonCurrentConditions,
  sumAccountsPayable,
  sumLoanInstallments,
  sumDeliveries,
  sumProvisions,
  sumFactionProvisions,
} from '@src/core/balance/contract-conditions';

const accountsPayable = computed(() => sumAccountsPayable(selfNonCurrentConditions));

const longTermDebt = computed(() => sumLoanInstallments(selfNonCurrentConditions));

const materialsToDeliver = computed(
  () =>
    sumDeliveries(selfNonCurrentConditions) +
    sumProvisions(selfNonCurrentConditions) +
    sumFactionProvisions(selfNonCurrentConditions),
);

const total = computed(() => {
  return accountsPayable.value + longTermDebt.value + materialsToDeliver.value;
});

export const nonCurrentLiabilities = {
  accountsPayable,
  longTermDebt,
  materialsToDeliver,
  total,
};
