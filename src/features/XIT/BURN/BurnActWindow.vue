<script setup lang="ts">
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { useMinBufferHeight } from '@src/hooks/use-min-buffer-height';
import ExecuteActionPackage from '@src/features/XIT/ACT/ExecuteActionPackage.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { ActionPackageConfig, configurableValue } from '@src/features/XIT/ACT/shared-types';
import { buildOffloadPackage } from '@src/features/XIT/ACT/actions/mtra/offload-package';
import { computeResupplyBill } from '@src/features/XIT/ACT/material-groups/resupply/bill';
import type { MaterialFilter } from '@src/features/XIT/ACT/material-groups/resupply/config';
import type { LogTag, LogContent } from '@src/features/XIT/ACT/runner/logger';
import Active from '@src/components/forms/Active.vue';
import RadioItem from '@src/components/forms/RadioItem.vue';

const parameters = useXitParameters();
const naturalId = parameters.join(' ');

useMinBufferHeight();

const site = computed(() => sitesStore.getByPlanetNaturalIdOrName(naturalId));
const planetName = computed(() =>
  site.value ? getEntityNameFromAddress(site.value.address) : undefined,
);

const agent = ref(false);

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
          skippable: true,
        },
        {
          type: 'MTRA' as UserData.ActionType,
          name: 'MTRA',
          group: 'Resupply',
          origin: configurableValue,
          dest: configurableValue,
          postToAgent: agent.value,
        },
      ],
    }) as UserData.ActionPackageData,
);

const generateReturnJson = ref(false);

function afterExecute(
  pkgConfig: ActionPackageConfig,
  log: (tag: LogTag, message: LogContent) => void,
) {
  if (!generateReturnJson.value) {
    return;
  }

  const resupplyGroup = pkg.value.groups[0];
  const mtraAction = pkg.value.actions.find(x => x.type === 'MTRA');
  if (!mtraAction) {
    return;
  }

  const groupName = resupplyGroup.name!;

  type ResupplyConfig = { planet?: string; days?: number; materialFilter?: MaterialFilter };
  type MtraConfig = { origin?: string; destination?: string };
  const groups = pkgConfig.materialGroups as unknown as Record<string, ResupplyConfig>;
  const actions = pkgConfig.actions as unknown as Record<string, MtraConfig>;
  const resupplyConfig = groups[groupName] ?? {};
  const mtraConfig = actions[mtraAction.name!] ?? {};

  const planet =
    resupplyGroup.planet === configurableValue ? resupplyConfig.planet : resupplyGroup.planet;
  const daysRaw = resupplyGroup.days;
  const days =
    daysRaw === configurableValue
      ? resupplyConfig.days
      : typeof daysRaw === 'number'
        ? daysRaw
        : parseFloat(daysRaw as string);
  const materialFilter = resupplyConfig.materialFilter;

  const materials = computeResupplyBill(resupplyGroup, planet, days, materialFilter) ?? {};
  const origin = mtraAction.dest === configurableValue ? mtraConfig.destination : mtraAction.dest;

  const result = buildOffloadPackage(groupName, materials, origin ?? configurableValue);

  log('INFO', 'Auto Offload JSON:');
  log(null, JSON.stringify(result, null, 2));
}
</script>

<template>
  <div v-if="!planetName">Planet "{{ naturalId }}" not found.</div>
  <ExecuteActionPackage v-else :pkg="pkg" :after-execute="afterExecute">
    <template #extra>
      <Active label="Generate Return JSON">
        <RadioItem v-model="generateReturnJson">generate return json</RadioItem>
      </Active>
      <Active label="Agent">
        <RadioItem v-model="agent">agent</RadioItem>
      </Active>
    </template>
  </ExecuteActionPackage>
</template>
