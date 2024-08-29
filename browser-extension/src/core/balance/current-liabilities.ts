import { computed } from 'vue';
import {
  selfCurrentConditions,
  sumAccountsPayable,
  sumLoanInstallments,
  sumDeliveries,
  sumProvisions,
  sumFactionProvisions,
} from '@src/core/balance/contract-conditions';

const accountsPayable = computed(() => sumAccountsPayable(selfCurrentConditions));

const shortTermDebt = computed(() => sumLoanInstallments(selfCurrentConditions));

const materialsToDeliver = computed(
  () =>
    sumDeliveries(selfCurrentConditions) +
    sumProvisions(selfCurrentConditions) +
    sumFactionProvisions(selfCurrentConditions),
);

const quick = computed(() => {
  return accountsPayable.value + shortTermDebt.value;
});

const total = computed(() => {
  return accountsPayable.value + shortTermDebt.value + materialsToDeliver.value;
});

export const currentLiabilities = {
  accountsPayable,
  shortTermDebt,
  materialsToDeliver,
  quick,
  total,
};
