import { computed } from 'vue';
import {
  selfCurrentConditions,
  sumAccountsPayable,
  sumLoanRepayments,
  sumDeliveries,
  sumProvisions,
  sumFactionProvisions,
  sumLoanInterest,
} from '@src/core/balance/contract-conditions';

const accountsPayable = computed(() => sumAccountsPayable(selfCurrentConditions));

const materialsToDeliver = computed(
  () =>
    sumDeliveries(selfCurrentConditions) +
    sumProvisions(selfCurrentConditions) +
    sumFactionProvisions(selfCurrentConditions),
);

const shortTermDebt = computed(() => sumLoanRepayments(selfCurrentConditions));

const interestPayable = computed(() => sumLoanInterest(selfCurrentConditions));

const quick = computed(() => {
  return accountsPayable.value + shortTermDebt.value + interestPayable.value;
});

const total = computed(() => {
  return (
    accountsPayable.value + materialsToDeliver.value + shortTermDebt.value + interestPayable.value
  );
});

export const currentLiabilities = {
  accountsPayable,
  materialsToDeliver,
  shortTermDebt,
  interestPayable,
  quick,
  total,
};
