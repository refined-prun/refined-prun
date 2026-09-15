<script setup lang="ts">
import ExecuteActionPackage from '@src/features/XIT/ACT/ExecuteActionPackage.vue';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { userData } from '@src/store/user-data';
import { comparePlanets } from '@src/util';

const parameters = useXitParameters();
const parameter = parameters.join(' ');

const pkg: UserData.ActionPackageData = parameter
  ? {
      global: { name: `GovBurn Data ${parameter}` },
      groups: [],
      actions: [{ type: 'GovBurn Data', name: 'Collect', planet: parameter }],
    }
  : {
      global: { name: 'GovBurn Data All' },
      groups: [],
      actions: Object.keys(userData.govburn.config.planets)
        .sort(comparePlanets)
        .map(naturalId => ({
          type: 'GovBurn Data',
          name: `Collect ${naturalId}`,
          planet: naturalId,
        })),
    };
</script>

<template>
  <ExecuteActionPackage :pkg="pkg" />
</template>
