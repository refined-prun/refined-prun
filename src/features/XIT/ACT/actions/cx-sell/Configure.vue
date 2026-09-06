<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import { Config } from '@src/features/XIT/ACT/actions/cx-sell/config';
import {
  atSameLocation,
  deserializeStorage,
  serializeStorage,
  storageSort,
} from '@src/features/XIT/ACT/actions/utils';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { exchangesStore } from '@src/infrastructure/prun-api/data/exchanges';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';

const { data, config } = defineProps<{ data: UserData.ActionData; config: Config }>();

const cxWarehouse = computed(() => {
  const exchange = data.exchange;
  if (!exchange) {
    return undefined;
  }

  const naturalId = exchangesStore.getNaturalIdFromCode(exchange);
  const warehouse = warehousesStore.getByEntityNaturalId(naturalId);
  return storagesStore.getById(warehouse?.storeId);
});

const originStorages = computed(() => {
  const warehouse = cxWarehouse.value;
  if (!warehouse) {
    return [];
  }

  return (storagesStore.nonFuelStores.value ?? [])
    .filter(x => atSameLocation(x, warehouse))
    .sort(storageSort);
});

const originOptions = computed(() => getOptions(originStorages.value));

if (data.origin === configurableValue && !config.origin && originStorages.value.length > 0) {
  config.origin = serializeStorage(originStorages.value[0]);
}

// Autofill and autofix selections on storage list change.
watchEffect(() => {
  if (data.origin !== configurableValue) {
    return;
  }

  if (config.origin) {
    const origin = deserializeStorage(config.origin);
    if (!origin || !originStorages.value.includes(origin)) {
      config.origin = undefined;
    }
  }

  if (!config.origin && originStorages.value.length === 1) {
    config.origin = serializeStorage(originStorages.value[0]);
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
