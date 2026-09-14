<script setup lang="ts">
import SelectInput from '@src/components/forms/SelectInput.vue';
import NumberInput from '@src/components/forms/NumberInput.vue';
import Active from '@src/components/forms/Active.vue';
import { Config } from '@src/features/XIT/ACT/material-groups/repair/config';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { comparePlanets } from '@src/util';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';
import { getRepairOffset, getRepairThreshold } from '@src/core/buildings';

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
  const seedPlanet = data.planet === configurableValue ? config.planet : data.planet;
  const seedSite = seedPlanet ? sitesStore.getByPlanetNaturalIdOrName(seedPlanet) : undefined;
  const seedNaturalId = seedSite ? getEntityNaturalIdFromAddress(seedSite.address) : undefined;
  config.days = getRepairThreshold(seedNaturalId) - getRepairOffset(seedNaturalId);
}

// REPAIRACT uses a 1-day time offset by default, not the user's XIT REP offset.
if (data.advanceDays === configurableValue && config.advanceDays === undefined) {
  config.advanceDays = 1;
}
</script>

<template>
  <form>
    <Active v-if="data.planet === configurableValue" label="Planet">
      <SelectInput v-model="config.planet" :options="planets" />
    </Active>
    <Active
      v-if="data.days === configurableValue"
      label="Day Threshold"
      tooltip="All buildings older than this threshold will be repaired.">
      <NumberInput v-model="config.days" float />
    </Active>
    <Active
      v-if="data.advanceDays === configurableValue"
      label="Time Offset"
      tooltip="The number of days in the future this repair will be conducted.">
      <NumberInput v-model="config.advanceDays" float />
    </Active>
  </form>
</template>
