import { computed, Ref } from 'vue';
import { contractsStore, isFactionContract } from '@src/infrastructure/prun-api/data/contracts';
import dayjs from 'dayjs';
import { timestampEachSecond } from '@src/utils/dayjs';
import { sumBy } from '@src/utils/sum-by';
import { calcMaterialAmountPrice } from '@src/infrastructure/fio/cx';
import { binarySearch } from '@src/utils/binary-search';

interface ContractCondition {
  contract: PrunApi.Contract;
  condition: PrunApi.ContractCondition;
  isSelf: boolean;
  deadline: number;
  dependencies: PrunApi.ContractCondition[];
}

const sortedConditions = computed(() => {
  const active = contractsStore.active.value;
  if (active === undefined) {
    return undefined;
  }
  const conditions: ContractCondition[] = [];
  for (const contract of active) {
    const activeConditions = contract.conditions.filter(x => x.status !== 'FULFILLED');
    for (const condition of activeConditions) {
      conditions.push({
        contract,
        condition,
        isSelf: condition.party === contract.party,
        deadline: calculateDeadline(contract, condition),
        dependencies: condition.dependencies
          .map(id => contract.conditions.find(x => x.id === id)!)
          .filter(x => !!x),
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
    return Number.POSITIVE_INFINITY;
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

  return latestDependency + condition.deadlineDuration.millis;
}

const accountingPeriod = dayjs.duration(1, 'week').asMilliseconds();

const currentSplitIndex = computed(() => {
  const sorted = sortedConditions.value;
  if (sorted === undefined) {
    return undefined;
  }
  const currentSplitDate = timestampEachSecond.value + accountingPeriod;
  return binarySearch(currentSplitDate, sorted, x => x.deadline);
});

export const selfConditions = computed(() => {
  return sortedConditions.value?.filter(x => x.isSelf);
});

export const currentConditions = computed(() => {
  return sortedConditions.value?.slice(0, currentSplitIndex.value);
});

export const selfCurrentConditions = computed(() => {
  return currentConditions.value?.filter(x => x.isSelf);
});

export const partnerCurrentConditions = computed(() => {
  return currentConditions.value?.filter(x => !x.isSelf);
});

export const nonCurrentConditions = computed(() => {
  return sortedConditions.value?.slice(currentSplitIndex.value);
});

export const selfNonCurrentConditions = computed(() => {
  return nonCurrentConditions.value?.filter(x => x.isSelf);
});

export const partnerNonCurrentConditions = computed(() => {
  return nonCurrentConditions.value?.filter(x => !x.isSelf);
});

type MaybeConditions = Ref<ContractCondition[] | undefined>;

export function sumAccountsPayable(conditions: MaybeConditions) {
  return sumConditions(conditions, ['PAYMENT', 'LOAN_PAYOUT'], x => x.amount!.amount);
}

export function sumLoanRepayments(conditions: MaybeConditions) {
  return sumConditions(conditions, ['LOAN_INSTALLMENT'], x => x.repayment!.amount);
}

export function sumLoanInterest(conditions: MaybeConditions) {
  const filtered = conditions.value?.filter(
    x =>
      x.condition.type === 'LOAN_INSTALLMENT' &&
      x.dependencies.every(y => y.status === 'FULFILLED'),
  );
  return sumBy(filtered, x => x.condition.interest!.amount);
}

export function sumDeliveries(conditions: MaybeConditions) {
  return sumConditions(conditions, ['DELIVERY'], getMaterialQuantityValue);
}

export function sumProvisions(conditions: MaybeConditions) {
  return sumConditions(conditions, ['PROVISION'], getMaterialQuantityValue);
}

export function sumFactionProvisions(conditions: MaybeConditions) {
  // Faction Logistics contracts request materials via PROVISION_SHIPMENT
  // contract conditions. Count them as liabilities.
  const filtered = conditions.value?.filter(
    x => isFactionContract(x.contract) && x.condition.type === 'PROVISION_SHIPMENT',
  );
  return sumBy(filtered, x => getMaterialQuantityValue(x.condition));
}

export function sumMaterialsPickup(conditions: MaybeConditions) {
  const filtered = conditions.value?.filter(
    x =>
      x.condition.type === 'COMEX_PURCHASE_PICKUP' &&
      x.dependencies.some(y => y.status !== 'FULFILLED'),
  );
  return sumBy(filtered, x => getMaterialQuantityValue(x.condition));
}

export function sumPendingMaterialsPickup(conditions: MaybeConditions) {
  const filtered = conditions.value?.filter(
    x =>
      x.condition.type === 'COMEX_PURCHASE_PICKUP' &&
      x.dependencies.every(y => y.status === 'FULFILLED'),
  );
  return sumBy(filtered, x => getMaterialQuantityValue(x.condition));
}

export function sumShipmentDeliveries(conditions: MaybeConditions) {
  let total = 0;
  const filtered = conditions.value?.filter(x => x.condition.type === 'DELIVERY_SHIPMENT');
  if (filtered === undefined) {
    return undefined;
  }
  for (const cc of filtered) {
    const pickup = findDependency(cc.contract, cc.condition, 'PICKUP_SHIPMENT');
    if (!pickup) {
      continue;
    }
    const provision = findDependency(cc.contract, pickup, 'PROVISION_SHIPMENT');
    if (provision?.status !== 'FULFILLED' || !provision?.quantity) {
      continue;
    }
    const value = getMaterialQuantityValue(provision);
    if (!value) {
      return undefined;
    }
    total += value;
  }
  return total;
}

function findDependency(
  contract: PrunApi.Contract,
  condition: PrunApi.ContractCondition,
  type: PrunApi.ContractConditionType,
) {
  for (const id of condition.dependencies) {
    const match = contract.conditions.find(x => x.id === id);
    if (match?.type === type) {
      return match;
    }
  }
  return undefined;
}

function sumConditions(
  conditions: MaybeConditions,
  types: PrunApi.ContractConditionType[],
  property: (item: PrunApi.ContractCondition) => number | undefined,
) {
  const filtered = conditions.value?.filter(x => types.includes(x.condition.type));
  return sumBy(filtered, x => property(x.condition));
}

function getMaterialQuantityValue(condition: PrunApi.ContractCondition) {
  return calcMaterialAmountPrice(condition.quantity!);
}
