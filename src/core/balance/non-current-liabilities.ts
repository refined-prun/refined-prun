import {
  selfNonCurrentConditions,
  sumAccountsPayable,
  sumLoanRepayments,
  sumDeliveries,
  sumProvisions,
  sumFactionProvisions,
} from '@src/core/balance/contract-conditions';
import { sum } from '@src/utils/sum';

const accountsPayable = computed(() => sumAccountsPayable(selfNonCurrentConditions));

const materialsPayable = computed(() =>
  sum(
    sumDeliveries(selfNonCurrentConditions),
    sumProvisions(selfNonCurrentConditions),
    sumFactionProvisions(selfNonCurrentConditions),
  ),
);

const longTermDebt = computed(() => sumLoanRepayments(selfNonCurrentConditions));

export const nonCurrentLiabilities = {
  accountsPayable,
  materialsPayable,
  longTermDebt,
};
