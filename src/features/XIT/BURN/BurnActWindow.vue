<script setup lang="ts">
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import ExecuteActionPackage from '@src/features/XIT/ACT/ExecuteActionPackage.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';
import { userData } from '@src/store/user-data';

// Join all parameters in case a naturalId was split on underscores by the XIT router.
const parameters = useXitParameters();
const naturalId = parameters.join(' ');

const site = computed(() => sitesStore.getByPlanetNaturalIdOrName(naturalId));
const planetName = computed(() =>
  site.value ? getEntityNameFromAddress(site.value.address) : undefined,
);

const pkg = computed(
  () =>
    ({
      global: { name: `Burn Resupply: ${planetName.value ?? naturalId}` },
      groups: [
        {
          type: 'Resupply' as UserData.MaterialGroupType,
          name: 'Resupply',
          planet: planetName.value,
          days: configurableValue,
          useBaseInv: true,
        },
      ],
      actions: [
        {
          type: 'CX Buy' as UserData.ActionType,
          name: 'CX Buy',
          group: 'Resupply',
          exchange: configurableValue,
          useCXInv: true,
        },
        {
          type: 'MTRA' as UserData.ActionType,
          name: 'MTRA',
          group: 'Resupply',
          origin: configurableValue,
          dest: configurableValue,
        },
      ],
    }) as UserData.ActionPackageData,
);
</script>

<template>
  <div v-if="!planetName">Planet "{{ naturalId }}" not found.</div>
  <ExecuteActionPackage v-else :pkg="pkg" />
</template>
