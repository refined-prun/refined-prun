<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import Passive from '@src/components/forms/Passive.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import { Config } from '@src/features/XIT/ACT/actions/mtra/config';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import {
  atSameLocation,
  deserializeStorage,
  serializeStorage,
  storageSort,
} from '@src/features/XIT/ACT/actions/mtra/utils';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';

const { data, config } = defineProps<{ data: UserData.ActionData; config: Config }>();

const allStorages = computed(() => {
  return storagesStore.all.value ?? [];
});

const originStorages = computed(() => {
  let storages = [...allStorages.value];
  if (data.dest !== configurableValue) {
    const destination = deserializeStorage(data.dest);
    if (destination) {
      storages = storages.filter(x => atSameLocation(x, destination) && x !== destination);
    }
  }
  return storages.sort(storageSort);
});

const originOptions = computed(() => {
  return getOptions(originStorages.value);
});

const destinationStorages = computed(() => {
  let storages = [...allStorages.value];
  if (data.origin !== configurableValue) {
    const origin = deserializeStorage(data.origin);
    if (origin) {
      storages = storages.filter(x => atSameLocation(x, origin) && x !== origin);
    }
  }

  return storages.sort(storageSort);
});

const destinationOptions = computed(() => {
  return getOptions(destinationStorages.value);
});

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

  if (data.dest === configurableValue) {
    if (config.destination) {
      const destination = deserializeStorage(config.destination);
      if (!destination || !destinationStorages.value.includes(destination)) {
        config.destination = undefined;
      }
    }

    if (!config.destination && destinationStorages.value.length === 1) {
      config.destination = serializeStorage(destinationStorages.value[0]);
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
    <Active v-if="data.origin === configurableValue" label="From">
      <SelectInput v-model="config.origin" :options="originOptions" />
    </Active>
    <Passive v-else label="From">
      <span>{{ data.origin }}</span>
    </Passive>
    <Active v-if="data.dest === configurableValue" label="To">
      <SelectInput v-model="config.destination" :options="destinationOptions" />
    </Active>
    <Passive v-else label="To">
      <span>{{ data.dest }}</span>
    </Passive>
  </form>
</template>
