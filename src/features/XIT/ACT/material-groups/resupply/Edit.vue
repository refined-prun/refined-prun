<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import SelectInput from '@src/components/forms/SelectInput.vue';
import NumberInput from '@src/components/forms/NumberInput.vue';
import { comparePlanets } from '@src/util';
import { isDefined } from 'ts-extras';
import TextInput from '@src/components/forms/TextInput.vue';
import RadioItem from '@src/components/forms/RadioItem.vue';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';

const { group } = defineProps<{ group: UserData.MaterialGroupData }>();

const planets = computed(() => {
  const planets = (sitesStore.all.value ?? [])
    .map(x => getEntityNameFromAddress(x.address))
    .filter(isDefined)
    .sort(comparePlanets);
  planets.unshift(configurableValue);
  return planets;
});

const planet = ref(group.planet ?? planets.value[0]);
const planetError = ref(false);

const days = ref(
  typeof group.days === 'string' ? parseInt(group.days || '10') : (group.days ?? 10),
);
const daysError = ref(false);

const exclusions = ref(group.exclusions?.join(', ') ?? '');

const useBaseInventory = ref(group.useBaseInv ?? true);

const workforceOnly = ref(group.consumablesOnly ?? false);

function validate() {
  let isValid = true;
  planetError.value = !planet.value;
  isValid &&= !planetError.value;
  daysError.value = days.value <= 0;
  isValid &&= !daysError.value;
  return isValid;
}

function save() {
  group.planet = planet.value;
  group.days = days.value;
  group.exclusions = exclusions.value
    .split(',')
    .map(x => materialsStore.getByTicker(x.trim())?.ticker)
    .filter(isDefined);
  group.useBaseInv = useBaseInventory.value;
  group.consumablesOnly = workforceOnly.value;
}

defineExpose({ validate, save });
</script>

<template>
  <Active label="Planet" :error="planetError">
    <SelectInput v-model="planet" :options="planets" />
  </Active>
  <Active
    label="Days"
    tooltip="The number of days of supplies to refill the planet with."
    :error="daysError">
    <NumberInput v-model="days" />
  </Active>
  <Active
    label="Material Exclusions"
    tooltip="Materials to be excluded from the group. List material tickers separated by commas.">
    <TextInput v-model="exclusions" />
  </Active>
  <Active
    label="Use Base Inv"
    tooltip="Whether to count the materials currently in the base towards the totals.">
    <RadioItem v-model="useBaseInventory">use base inv</RadioItem>
  </Active>
  <Active
    label="Workforce Only"
    tooltip="Whether to limit the materials in the group to workforce consumables only.">
    <RadioItem v-model="workforceOnly">workforce only</RadioItem>
  </Active>
</template>
