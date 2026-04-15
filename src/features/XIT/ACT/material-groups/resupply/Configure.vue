<script setup lang="ts">
import SelectInput from '@src/components/forms/SelectInput.vue';
import Active from '@src/components/forms/Active.vue';
import NumberInput from '@src/components/forms/NumberInput.vue';
import { Config } from '@src/features/XIT/ACT/material-groups/resupply/config';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { comparePlanets } from '@src/util';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';
import { userData } from '@src/store/user-data';

const { data, config } = defineProps<{ data: UserData.MaterialGroupData; config: Config }>();

const planets = computed(() =>
  (sitesStore.all.value ?? [])
    .map(x => getEntityNameFromAddress(x.address))
    .filter(x => x !== undefined)
    .sort(comparePlanets),
);

if (data.planet === configurableValue && !config.planet) {
  config.planet = planets.value[0];
}

if (data.days === configurableValue && config.days === undefined) {
  config.days = userData.settings.burn.resupply ?? 10;
}
</script>

<template>
  <form>
    <Active v-if="data.planet === configurableValue" label="Planet">
      <SelectInput v-model="config.planet" :options="planets" />
    </Active>
    <Active
      v-if="data.days === configurableValue"
      label="Days"
      tooltip="The number of days of supplies to refill the planet with.">
      <NumberInput v-model="config.days" />
    </Active>
  </form>
</template>
