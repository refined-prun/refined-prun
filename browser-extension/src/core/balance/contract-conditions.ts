import { computed, Ref } from 'vue';
import { contractsStore } from '@src/prun-api/data/contracts';
import dayjs from 'dayjs';
import { timestampLive } from '@src/utils/dayjs';
import { sumBy } from '@src/utils/sum-by';
import { castArray } from '@src/utils/cast-array';
import { getPrice } from '@src/fio/cx';
import { binarySearch } from '@src/utils/binary-search';

interface ContractCondition {
  condition: PrunApi.ContractCondition;
  isSelf: boolean;
  deadline: number;
  hasPendingDependencies: boolean;
}

const sortedConditions = computed(() => {
  const conditions: ContractCondition[] = [];
  for (const contract of contractsStore.active.value) {
    const activeConditions = contract.conditions.filter(x => x.status !== 'FULFILLED');
    for (const condition of activeConditions) {
      conditions.push({
        condition,
        isSelf: condition.party === contract.party,
        deadline: calculateDeadline(contract, condition),
        hasPendingDependencies: hasPendingDependencies(contract, condition),
      });
    }
  }
  conditions.sort((a, b) => a.deadline - b.deadline);
  return conditions;
});

function calculateDeadline(contract: PrunApi.Contract, condition: PrunApi.ContractCondition) {
  if (condition.deadline) {
    return condition.deadline.timestamp;
  }

  if (!condition.deadlineDuration) {
    return Number.MAX_VALUE;
  }

  let latestDependency = contract.date.timestamp;
  for (const dependency of condition.dependencies) {
    const dependencyCondition = contract.conditions.find(x => x.id === dependency);
    if (dependencyCondition) {
      latestDependency = Math.max(
        latestDependency,
        calculateDeadline(contract, dependencyCondition),
      );
    }
  }

  if (latestDependency === Number.MAX_VALUE) {
    return latestDependency;
  }

  return latestDependency + condition.deadlineDuration.millis;
}

function hasPendingDependencies(contract: PrunApi.Contract, condition: PrunApi.ContractCondition) {
  return condition.dependencies
    .map(id => contract.conditions.find(x => x.id === id))
    .some(x => x?.status !== 'FULFILLED');
}

const accountingPeriod = dayjs.duration(1, 'week').asMilliseconds();

const currentSplitIndex = computed(() => {
  const currentSplitDate = timestampLive() + accountingPeriod;
  return binarySearch(currentSplitDate, sortedConditions.value, x => x.deadline);
});

export const selfConditions = computed(() => {
  return sortedConditions.value.filter(x => x.isSelf);
});

export const currentConditions = computed(() => {
  return sortedConditions.value.slice(0, currentSplitIndex.value);
});

export const selfCurrentConditions = computed(() => {
  return currentConditions.value.filter(x => x.isSelf);
});

export const partnerCurrentConditions = computed(() => {
  return currentConditions.value.filter(x => !x.isSelf);
});

export const nonCurrentConditions = computed(() => {
  return sortedConditions.value.slice(currentSplitIndex.value);
});

export const selfNonCurrentConditions = computed(() => {
  return nonCurrentConditions.value.filter(x => x.isSelf);
});

export const partnerNonCurrentConditions = computed(() => {
  return nonCurrentConditions.value.filter(x => !x.isSelf);
});

export function sumAccountsPayable(conditions: Ref<ContractCondition[]>) {
  return sumConditions(conditions, ['PAYMENT', 'LOAN_PAYOUT'], x => x.amount!.amount);
}

export function sumLoanInstallments(conditions: Ref<ContractCondition[]>) {
  return sumConditions(
    conditions,
    'LOAN_INSTALLMENT',
    x => x.interest!.amount + x.repayment!.amount,
  );
}

export function sumMaterialsPayable(conditions: Ref<ContractCondition[]>) {
  return sumConditions(
    conditions,
    ['DELIVERY', 'PROVISION'],
    x => getPrice(x.quantity!.material.ticker) * x.quantity!.amount,
  );
}

export function sumMaterialsPickup(conditions: Ref<ContractCondition[]>) {
  return sumConditions(
    computed(() => conditions.value.filter(x => !x.hasPendingDependencies)),
    ['COMEX_PURCHASE_PICKUP'],
    x => getPrice(x.quantity!.material.ticker) * x.quantity!.amount,
  );
}

function sumConditions(
  conditions: Ref<ContractCondition[]>,
  types: Arrayable<PrunApi.ContractConditionType>,
  property: (item: PrunApi.ContractCondition) => number,
) {
  types = castArray(types);
  const filtered = conditions.value.filter(x => types.includes(x.condition.type));
  return sumBy(filtered, x => property(x.condition));
}
