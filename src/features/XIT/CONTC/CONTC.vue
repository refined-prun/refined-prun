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
  selfNonCurrentConditions.value!.filter(x => x.dependencies.every(x => x.status === 'FULFILLED')),
);
</script>

<template>
  <LoadingSpinner v-if="!contractsStore.fetched" />
  <table v-else>
    <thead>
      <tr>
        <th>Contract</th>
        <th>Deadline</th>
        <th>Condition</th>
        <th></th>
      </tr>
    </thead>
    <template v-if="partnerViolated.length > 0">
      <thead>
        <tr>
          <th colspan="3">Violated Conditions (Partner)</th>
        </tr>
      </thead>
      <tbody>
        <ConditionRow
          v-for="x in partnerViolated"
          :key="x.condition.id"
          :contract="x.contract"
          :condition="x.condition"
          :deadline="x.deadline" />
      </tbody>
    </template>
    <template v-if="currentViolated.length > 0">
      <thead>
        <tr>
          <th colspan="3">Violated Conditions (Self)</th>
        </tr>
      </thead>
      <tbody>
        <ConditionRow
          v-for="x in currentViolated"
          :key="x.condition.id"
          :contract="x.contract"
          :condition="x.condition"
          :deadline="x.deadline" />
      </tbody>
    </template>
    <thead>
      <tr>
        <th colspan="4">Current Conditions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="isEmpty(currentNonViolated)">
        <td colspan="4">No pending conditions</td>
      </tr>
      <template v-else>
        <ConditionRow
          v-for="x in currentNonViolated"
          :key="x.condition.id"
          :contract="x.contract"
          :condition="x.condition"
          :deadline="x.deadline" />
      </template>
    </tbody>
    <thead>
      <tr>
        <th colspan="4">Non-Current Conditions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="isEmpty(nonCurrent)">
        <td colspan="4">No pending conditions</td>
      </tr>
      <template v-else>
        <ConditionRow
          v-for="x in nonCurrent"
          :key="x.condition.id"
          :contract="x.contract"
          :condition="x.condition"
          :deadline="x.deadline" />
      </template>
    </tbody>
  </table>
</template>

<style scoped></style>
