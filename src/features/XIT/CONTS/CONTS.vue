<script setup lang="ts">
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import ContractRow from '@src/features/XIT/CONTS/ContractRow.vue';
import { isEmpty } from 'ts-extras';
import { canAcceptContract } from '@src/features/XIT/CONTS/utils';

const filtered = computed(() =>
  contractsStore.all.value!.filter(shouldShowContract).sort(compareContracts),
);

function shouldShowContract(contract: PrunApi.Contract) {
  switch (contract.status) {
    case 'OPEN':
    case 'CLOSED':
    case 'PARTIALLY_FULFILLED':
    case 'DEADLINE_EXCEEDED': {
      return true;
    }
    default: {
      return false;
    }
  }
}

function compareContracts(a: PrunApi.Contract, b: PrunApi.Contract) {
  if (canAcceptContract(a) && !canAcceptContract(b)) {
    return -1;
  }
  if (canAcceptContract(b) && !canAcceptContract(a)) {
    return 1;
  }
  return (b.date?.timestamp ?? 0) - (a.date?.timestamp ?? 0);
}
</script>

<template>
  <LoadingSpinner v-if="!contractsStore.fetched" />
  <table v-else>
    <thead>
      <tr>
        <th>Contract</th>
        <th>Item</th>
        <th>Partner</th>
        <th>Self</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="isEmpty(filtered)">
        <td colspan="4">No active contracts</td>
      </tr>
      <template v-else>
        <ContractRow v-for="contract in filtered" :key="contract.id" :contract="contract" />
      </template>
    </tbody>
  </table>
</template>
