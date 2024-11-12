import {
  selfCurrentConditions,
  sumAccountsPayable,
  sumLoanRepayments,
  sumDeliveries,
  sumProvisions,
  sumFactionProvisions,
  sumLoanInterest,
} from '@src/core/balance/contract-conditions';
import { sum } from '@src/utils/sum';

const accountsPayable = computed(() => sumAccountsPayable(selfCurrentConditions));

const materialsPayable = computed(() =>
  sum(
    sumDeliveries(selfCurrentConditions),
    sumProvisions(selfCurrentConditions),
    sumFactionProvisions(selfCurrentConditions),
  ),
);

const shortTermDebt = computed(() => sumLoanRepayments(selfCurrentConditions));

const interestPayable = computed(() => sumLoanInterest(selfCurrentConditions));

export const currentLiabilities = {
  accountsPayable,
  materialsPayable,
  shortTermDebt,
  interestPayable,
};
