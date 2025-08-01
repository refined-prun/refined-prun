<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { serializeStorage, storageSort } from '@src/features/XIT/ACT/actions/utils';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';

const { action, pkg } = defineProps<{
  action: UserData.ActionData;
  pkg: UserData.ActionPackageData;
}>();

const materialGroups = computed(() => pkg.groups.map(x => x.name!).filter(x => x));
const materialGroup = ref(action.group ?? materialGroups.value[0]);

const storages = computed(() => {
  const storages = [...(storagesStore.all.value ?? [])]
    .filter(x => x.type !== 'STL_FUEL_STORE' && x.type !== 'FTL_FUEL_STORE')
    .sort(storageSort)
    .map(serializeStorage);
  storages.unshift(configurableValue);
  return storages;
});

const origin = ref(action.origin ?? storages.value[0]);
const destination = ref(action.dest ?? storages.value[0]);

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
    <SelectInput v-model="destination" :options="storages" />
  </Active>
</template>
