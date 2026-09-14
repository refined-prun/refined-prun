<script setup lang="ts">
import ExecuteActionPackage from '@src/features/XIT/ACT/ExecuteActionPackage.vue';
import { allExchangesValue } from '@src/features/XIT/ACT/actions/refuel/utils';

const pkg: UserData.ActionPackageData = {
  global: { name: 'Refuel All Exchanges' },
  groups: [],
  actions: [
    {
      type: 'Refuel',
      name: 'Refuel',
      origin: allExchangesValue,
      buyMissingFuel: true,
    },
  ],
};
</script>

<template>
  <ExecuteActionPackage :pkg="pkg" />
</template>
