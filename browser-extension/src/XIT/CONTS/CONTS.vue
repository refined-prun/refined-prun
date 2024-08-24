<script lang="ts">
import xit from '@src/XIT/xit-registry';
import CONTS from '@src/XIT/CONTS/CONTS.vue';

xit.add({
  command: ['CONTS', 'CONTRACTS'],
  name: 'ACTIVE CONTRACTS',
  component: () => CONTS,
});

export default {};
</script>

<script setup lang="ts">
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { contractsStore } from '@src/prun-api/data/contracts';
import { computed } from 'vue';
import ContractRow from '@src/XIT/CONTS/ContractRow.vue';

const filtered = computed(() =>
  contractsStore.all.value.filter(shouldShowContract).sort(compareContracts),
);

function shouldShowContract(contract: PrunApi.Contract) {
  switch (contract.status) {
    case 'OPEN':
    case 'CLOSED':
    case 'PARTIALLY_FULFILLED': {
      return true;
    }
    default: {
      return false;
    }
  }
}

function compareContracts(a: PrunApi.Contract, b: PrunApi.Contract) {
  return (a.date?.timestamp ?? 0) - (b.date?.timestamp ?? 0);
}
</script>

<template>
  <LoadingSpinner v-if="!contractsStore.fetched" />
  <table v-else>
    <thead>
      <tr>
        <th>Name</th>
        <th>Material</th>
        <th>Partner&apos;s Conditions</th>
        <th>My Conditions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="filtered.length === 0">
        <td colspan="4">No active contracts</td>
      </tr>
      <template v-else>
        <ContractRow v-for="contract in filtered" :key="contract.id" :contract="contract" />
      </template>
    </tbody>
  </table>
</template>

<style scoped></style>
