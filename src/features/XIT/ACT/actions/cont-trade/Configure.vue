<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import Passive from '@src/components/forms/Passive.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import { Config } from '@src/features/XIT/ACT/actions/cont-trade/config';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';
import {
  useContLocations,
  displayLocationValue,
} from '@src/features/XIT/ACT/actions/cont-locations';

const { data, config } = defineProps<{ data: UserData.ActionData; config: Config }>();

const locations = useContLocations();

if (data.contLocation === configurableValue && !config.location && locations.value.length > 0) {
  config.location = locations.value[0];
}

watchEffect(() => {
  if (data.contLocation === configurableValue) {
    if (config.location && !locations.value.includes(config.location)) {
      config.location = undefined;
    }
    if (!config.location && locations.value.length === 1) {
      config.location = locations.value[0];
    }
  }
});
</script>

<template>
  <form>
    <Active v-if="data.contLocation === configurableValue" label="Location">
      <SelectInput v-model="config.location" :options="locations" />
    </Active>
    <Passive v-else label="Location">
      <span>{{ displayLocationValue(data.contLocation) }}</span>
    </Passive>
  </form>
</template>
