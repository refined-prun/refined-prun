import { computed } from 'vue';
import {
  selfCurrentConditions,
  sumAccountsPayable,
  sumLoanInstallments,
  sumMaterialsPayable,
} from '@src/core/balance/contract-conditions';

const accountsPayable = computed(() => sumAccountsPayable(selfCurrentConditions));

const shortTermDebt = computed(() => sumLoanInstallments(selfCurrentConditions));

const materialsToDeliver = computed(() => sumMaterialsPayable(selfCurrentConditions));

const total = computed(() => {
  return accountsPayable.value + shortTermDebt.value + materialsToDeliver.value;
});

export const currentLiabilities = {
  accountsPayable,
  shortTermDebt,
  materialsToDeliver,
  total,
};
