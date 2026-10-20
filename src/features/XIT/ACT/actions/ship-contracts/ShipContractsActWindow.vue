<script setup lang="ts">
import ExecuteActionPackage from '@src/features/XIT/ACT/ExecuteActionPackage.vue';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { parseShipContractsAdKey } from '@src/features/XIT/ACT/actions/ship-contracts/command';

const [ship, destination, ...parameters] = useXitParameters();
const adKeys = parameters.map(parseShipContractsAdKey);

const pkg: UserData.ActionPackageData = {
  global: { name: 'Load Shipping Contracts' },
  groups: [],
  actions: [
    { type: 'Ship Contracts', name: 'Ship Contracts', ship, sfcDestination: destination, adKeys },
  ],
};
</script>

<template>
  <ExecuteActionPackage :pkg="pkg" />
</template>
