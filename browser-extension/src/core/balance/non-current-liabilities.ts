import { computed } from 'vue';
import {
  selfNonCurrentConditions,
  sumAccountsPayable,
  sumLoanInstallments,
  sumMaterialsPayable,
} from '@src/core/balance/contract-conditions';

const accountsPayable = computed(() => sumAccountsPayable(selfNonCurrentConditions));

const longTermDebt = computed(() => sumLoanInstallments(selfNonCurrentConditions));

const materialsPayable = computed(() => sumMaterialsPayable(selfNonCurrentConditions));

const total = computed(() => {
  return accountsPayable.value + longTermDebt.value + materialsPayable.value;
});

export const nonCurrentLiabilities = {
  accountsPayable,
  shortTermDebt: longTermDebt,
  materialsPayable,
  total,
};
