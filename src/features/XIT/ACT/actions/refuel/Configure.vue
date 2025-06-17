<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import { Config } from '@src/features/XIT/ACT/actions/mtra/config';
import {
  deserializeStorage,
  serializeStorage,
  storageSort,
} from '@src/features/XIT/ACT/actions/utils';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';
import { getRefuelOrigins } from '@src/features/XIT/ACT/actions/refuel/utils';

const { data, config } = defineProps<{ data: UserData.ActionData; config: Config }>();

const originStorages = computed(() => getRefuelOrigins().sort(storageSort));

const originOptions = computed(() => getOptions(originStorages.value));

if (data.origin === configurableValue && !config.origin && originStorages.value.length > 0) {
  config.origin = serializeStorage(originStorages.value[0]);
}

// Autofill and autofix selections on storage list change.
watchEffect(() => {
  if (data.origin === configurableValue) {
    if (config.origin) {
      const origin = deserializeStorage(config.origin);
      if (!origin || !originStorages.value.includes(origin)) {
        config.origin = undefined;
      }
    }

    if (!config.origin && originStorages.value.length === 1) {
      config.origin = serializeStorage(originStorages.value[0]);
    }
  }
});

function getOptions(storages: PrunApi.Store[]) {
  const options = storages.map(serializeStorage).map(x => ({ label: x, value: x }));
  if (options.length === 0) {
    options.push({ label: 'No locations available', value: undefined! });
  }
  return options;
}
</script>

<template>
  <form>
    <Active label="From">
      <SelectInput v-model="config.origin" :options="originOptions" />
    </Active>
  </form>
</template>
