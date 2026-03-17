<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { serializeStorage, storageSort } from '@src/features/XIT/ACT/actions/utils';
import { actionTargetPrefix, configurableValue } from '@src/features/XIT/ACT/shared-types';

const { action, pkg } = defineProps<{
  action: UserData.ActionData;
  pkg: UserData.ActionPackageData;
}>();

type Option = string | { label: string; value: string };

const materialGroups = computed(() => pkg.groups.map(x => x.name!).filter(x => x));
const materialGroup = ref(action.group ?? materialGroups.value[0]);

const storages = computed(() => {
  const storages: Option[] = [...(storagesStore.nonFuelStores.value ?? [])]
    .sort(storageSort)
    .map(serializeStorage);
  storages.unshift(configurableValue);
  return storages;
});

const destinationOptions = computed(() => {
  const options: Option[] = [...storages.value];

  // Add reference options for MTRA actions above this one.
  const currentIndex = pkg.actions.indexOf(action);
  let insertAt = 1;
  for (let i = 0; i < currentIndex; i++) {
    const other = pkg.actions[i];
    if (!other.name || other.type !== 'MTRA' || !other.dest) {
      continue;
    }
    options.splice(insertAt++, 0, {
      label: `Same as: ${other.name} dest`,
      value: actionTargetPrefix + other.name,
    });
  }

  return options;
});

const origin = ref(action.origin ?? (storages.value[0] as string));
const destination = ref(action.dest ?? (storages.value[0] as string));

function validate() {
  return true;
}

function save() {
  action.group = materialGroup.value;
  action.origin = origin.value;
  action.dest = destination.value;
}

defineExpose({ validate, save });
</script>

<template>
  <Active label="Material Group">
    <SelectInput v-model="materialGroup" :options="materialGroups" />
  </Active>
  <Active label="Origin">
    <SelectInput v-model="origin" :options="storages" />
  </Active>
  <Active label="Destination">
    <SelectInput v-model="destination" :options="destinationOptions" />
  </Active>
</template>
