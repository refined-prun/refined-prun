<script setup lang="ts">
import SelectInput from '@src/components/forms/SelectInput.vue';
import Active from '@src/components/forms/Active.vue';
import { Config } from '@src/features/XIT/ACT/material-groups/repair/config';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { isDefined } from 'ts-extras';
import { comparePlanets } from '@src/util';

const { config } = defineProps<{ data: UserData.ActionData; config: Config }>();

const planets = computed(() =>
  (sitesStore.all.value ?? [])
    .map(x => getEntityNameFromAddress(x.address))
    .filter(isDefined)
    .sort(comparePlanets),
);
</script>

<template>
  <form>
    <Active label="Planet">
      <SelectInput v-model="config.planet" :options="planets" />
    </Active>
  </form>
</template>
