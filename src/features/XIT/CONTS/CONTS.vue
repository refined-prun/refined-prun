<script setup lang="ts">
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import ContractRow from '@src/features/XIT/CONTS/ContractRow.vue';
import { isEmpty } from 'ts-extras';
import { canAcceptContract } from '@src/features/XIT/CONTS/utils';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { convertToPlanetNaturalId } from '@src/core/planet-natural-id';
import { findWithQuery } from '@src/utils/find-with-query';

const parameters = useXitParameters();

const queryResult = computed(() => {
  if (parameters.length === 0 || !contractsStore.all.value) {
    return contractsStore.all.value;
  }
  const contractsByNaturalId = new Map<string, Set<PrunApi.Contract>>();
  for (const contract of contractsStore.all.value ?? []) {
    for (const condition of contract.conditions) {
      const naturalId = getEntityNaturalIdFromAddress(condition.address);
      if (naturalId) {
        contractsByNaturalId.set(
          naturalId,
          (contractsByNaturalId.get(naturalId) ?? new Set()).add(contract),
        );
      }
      const destinationNaturalId = getEntityNaturalIdFromAddress(condition.destination);
      if (destinationNaturalId) {
        contractsByNaturalId.set(
          destinationNaturalId,
          (contractsByNaturalId.get(destinationNaturalId) ?? new Set()).add(contract),
        );
      }
    }
  }
  const result = findWithQuery(parameters, (term, parts) =>
    findContracts(term, parts, contractsStore.all.value, contractsByNaturalId),
  );
  let matches = result.include;
  // In my opinion, the only time that a query with no results should return everything is when the only term is a 'NOT' term.
  // This only tests if the first term is a 'NOT' term, but I cannot think of a reason to combine regular terms and 'NOT' terms anyway.
  // This way, the query can return no results when a given location has no contracts.
  if (result.includeAll && parameters[0]?.toLowerCase() == 'not') {
    matches = contractsStore.all.value;
  }
  if (result.excludeAll) {
    matches = [];
  }
  matches = matches.filter(x => !result.exclude.has(x));
  return matches;
});

function findContracts(
  term: string,
  parts: string[],
  contracts: PrunApi.Contract[] | undefined,
  contractsByNaturalId: Map<string, Set<PrunApi.Contract>>,
) {
  if (term === 'all') {
    return contracts;
  }

  const naturalId = convertToPlanetNaturalId(term, parts);
  if (!naturalId) {
    return;
  }
  const result = contractsByNaturalId.get(naturalId);
  if (result) {
    return Array.from(result.values());
  }
  return result;
}

const filtered = computed(() =>
  queryResult.value!.filter(shouldShowContract).sort(compareContracts),
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
