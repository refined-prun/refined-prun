<script setup lang="ts">
import {
  selfCurrentConditions,
  selfNonCurrentConditions,
} from '@src/core/balance/contract-conditions';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import ConditionRow from '@src/features/XIT/CONTC/ConditionRow.vue';
import { isEmpty } from 'ts-extras';

const current = computed(() =>
  selfCurrentConditions.value!.filter(x => x.dependencies.every(x => x.status === 'FULFILLED')),
);

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
      </tr>
    </thead>
    <thead>
      <tr>
        <th colspan="3">Current Conditions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="isEmpty(current)">
        <td colspan="3">No pending conditions</td>
      </tr>
      <template v-else>
        <ConditionRow
          v-for="x in current"
          :key="x.condition.id"
          :contract="x.contract"
          :condition="x.condition"
          :deadline="x.deadline" />
      </template>
    </tbody>
    <thead>
      <tr>
        <th colspan="3">Non-Current Conditions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="isEmpty(nonCurrent)">
        <td colspan="3">No pending conditions</td>
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
