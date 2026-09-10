<script setup lang="ts">
import SelectInput from '@src/components/forms/SelectInput.vue';
import Active from '@src/components/forms/Active.vue';
import { Config } from '@src/features/XIT/ACT/material-groups/repair/config';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { comparePlanets } from '@src/util';

const { config } = defineProps<{ data: UserData.ActionData; config: Config }>();

const planets = computed(() =>
  (sitesStore.all.value ?? [])
    .map(x => getEntityNameFromAddress(x.address))
    .filter(x => x !== undefined)
    .sort(comparePlanets),
);

if (!config.planet) {
  config.planet = planets.value[0];
}
</script>

<template>
  <form>
    <Active label="Planet">
      <SelectInput v-model="config.planet" :options="planets" />
    </Active>
  </form>
</template>
