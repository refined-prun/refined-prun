<script setup lang="ts">
import {
  partnerCurrentConditions,
  selfCurrentConditions,
  selfNonCurrentConditions,
} from '@src/core/balance/contract-conditions';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import ConditionRow from '@src/features/XIT/CONTC/ConditionRow.vue';
import { isEmpty } from 'ts-extras';
import { compareConditions } from './compare-conditions';
import { isFulfillable } from '@src/core/contract-conditions';

const partnerViolated = computed(() =>
  partnerCurrentConditions.value!.filter(
    x => x.condition.status === 'VIOLATED' && x.dependencies.every(x => x.status === 'FULFILLED'),
  ),
);

const current = computed(() =>
  selfCurrentConditions.value!.filter(x => x.dependencies.every(x => x.status === 'FULFILLED')),
);

const currentViolated = computed(() => {
  return current.value!.filter(x => x.condition.status === 'VIOLATED');
});

const currentNonViolated = computed(() => {
  return current.value!.filter(x => x.condition.status !== 'VIOLATED');
});

const nonCurrent = computed(() =>
  selfNonCurrentConditions
    .value!.filter(x => x.dependencies.every(x => x.status === 'FULFILLED'))
    .toSorted((a, b) => compareConditions(a.condition, b.condition)),
);

const showFulfill = computed(() =>
  [...current.value, ...nonCurrent.value].some(x => isFulfillable(x.contract, x.condition)),
);
const columnCount = computed(() => (showFulfill.value ? 4 : 3));
</script>

<template>
  <LoadingSpinner v-if="!contractsStore.fetched" />
  <table v-else>
    <thead>
      <tr>
        <th>Contract</th>
        <th>Deadline</th>
        <th>Condition</th>
        <th v-if="showFulfill"></th>
      </tr>
    </thead>
    <template v-if="partnerViolated.length > 0">
      <thead>
        <tr>
          <th :colspan="columnCount">Violated Conditions (Partner)</th>
        </tr>
      </thead>
      <tbody>
        <ConditionRow
          v-for="x in partnerViolated"
          :key="x.condition.id"
          :contract="x.contract"
          :condition="x.condition"
          :deadline="x.deadline"
          :show-fulfill="showFulfill" />
      </tbody>
    </template>
    <template v-if="currentViolated.length > 0">
      <thead>
        <tr>
          <th :colspan="columnCount">Violated Conditions (Self)</th>
        </tr>
      </thead>
      <tbody>
        <ConditionRow
          v-for="x in currentViolated"
          :key="x.condition.id"
          :contract="x.contract"
          :condition="x.condition"
          :deadline="x.deadline"
          :show-fulfill="showFulfill" />
      </tbody>
    </template>
    <thead>
      <tr>
        <th :colspan="columnCount">Current Conditions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="isEmpty(currentNonViolated)">
        <td :colspan="columnCount">No pending conditions</td>
      </tr>
      <template v-else>
        <ConditionRow
          v-for="x in currentNonViolated"
          :key="x.condition.id"
          :contract="x.contract"
          :condition="x.condition"
          :deadline="x.deadline"
          :show-fulfill="showFulfill" />
      </template>
    </tbody>
    <thead>
      <tr>
        <th :colspan="columnCount">Non-Current Conditions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="isEmpty(nonCurrent)">
        <td :colspan="columnCount">No pending conditions</td>
      </tr>
      <template v-else>
        <ConditionRow
          v-for="x in nonCurrent"
          :key="x.condition.id"
          :contract="x.contract"
          :condition="x.condition"
          :deadline="x.deadline"
          :show-fulfill="showFulfill" />
      </template>
    </tbody>
  </table>
</template>

<style scoped></style>
