<script setup lang="ts">
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { useMinBufferHeight } from '@src/hooks/use-min-buffer-height';
import ExecuteActionPackage from '@src/features/XIT/ACT/ExecuteActionPackage.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';

const parameters = useXitParameters();
const naturalId = parameters.join(' ');

useMinBufferHeight();

const site = computed(() => sitesStore.getByPlanetNaturalIdOrName(naturalId));
const planetName = computed(() =>
  site.value ? getEntityNameFromAddress(site.value.address) : undefined,
);

const pkg = computed(
  () =>
    ({
      global: { name: `Repair: ${planetName.value ?? naturalId}` },
      groups: [
        {
          type: 'Repair' as UserData.MaterialGroupType,
          name: 'Repair',
          planet: planetName.value,
          days: configurableValue,
          advanceDays: configurableValue,
        },
      ],
      actions: [
        {
          type: 'CX Buy' as UserData.ActionType,
          name: 'CX Buy',
          group: 'Repair',
          exchange: configurableValue,
          useCXInv: true,
          skippable: true,
        },
        {
          type: 'MTRA' as UserData.ActionType,
          name: 'MTRA',
          group: 'Repair',
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
