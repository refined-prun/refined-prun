<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import Passive from '@src/components/forms/Passive.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import { Config } from '@src/features/XIT/ACT/actions/cont-ship/config';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';
import { serializeStorage } from '@src/features/XIT/ACT/actions/utils';
import {
  useContLocations,
  displayLocationValue,
} from '@src/features/XIT/ACT/actions/cont-locations';

const { data, config } = defineProps<{ data: UserData.ActionData; config: Config }>();

const locations = useContLocations();

if (data.contOrigin === configurableValue && !config.origin && locations.value.length > 0) {
  config.origin = locations.value[0];
}

if (data.contDest === configurableValue && !config.destination && locations.value.length > 0) {
  config.destination = locations.value[0];
}

watchEffect(() => {
  if (data.contOrigin === configurableValue) {
    if (config.origin && !locations.value.includes(config.origin)) {
      config.origin = undefined;
    }
    if (!config.origin && locations.value.length === 1) {
      config.origin = locations.value[0];
    }
  }

  if (data.contDest === configurableValue) {
    if (config.destination && !locations.value.includes(config.destination)) {
      config.destination = undefined;
    }
    if (!config.destination && locations.value.length === 1) {
      config.destination = locations.value[0];
    }
  }
});

const resolvedOrigin = computed(() => {
  if (data.contOrigin === configurableValue) {
    return config.origin;
  }
  return data.contOrigin;
});

const storeOptions = computed(() => {
  const origin = resolvedOrigin.value;
  if (!origin || !data.autoProvision) {
    return [];
  }
  const result: { label: string; value: string }[] = [];
  for (const store of storagesStore.nonFuelStores.value ?? []) {
    let address: PrunApi.Address | undefined;
    if (store.type === 'STORE') {
      address = sitesStore.getById(store.addressableId)?.address;
    } else if (store.type === 'WAREHOUSE_STORE') {
      address = warehousesStore.getById(store.addressableId)?.address;
    } else {
      continue;
    }
    const name = getEntityNameFromAddress(address);
    if (name === origin) {
      result.push({ label: serializeStorage(store), value: store.id });
    }
  }
  return result;
});

if (data.autoProvision && !config.autoProvisionStoreId && storeOptions.value.length > 0) {
  config.autoProvisionStoreId = storeOptions.value[0].value;
}

watchEffect(() => {
  if (data.autoProvision) {
    const ids = new Set(storeOptions.value.map(o => o.value));
    if (config.autoProvisionStoreId && !ids.has(config.autoProvisionStoreId)) {
      config.autoProvisionStoreId = undefined;
    }
    if (!config.autoProvisionStoreId && storeOptions.value.length > 0) {
      config.autoProvisionStoreId = storeOptions.value[0].value;
    }
  }
});
</script>

<template>
  <form>
    <Active v-if="data.contOrigin === configurableValue" label="From">
      <SelectInput v-model="config.origin" :options="locations" />
    </Active>
    <Passive v-else label="From">
      <span>{{ displayLocationValue(data.contOrigin) }}</span>
    </Passive>
    <Active v-if="data.contDest === configurableValue" label="To">
      <SelectInput v-model="config.destination" :options="locations" />
    </Active>
    <Passive v-else label="To">
      <span>{{ displayLocationValue(data.contDest) }}</span>
    </Passive>
    <Active v-if="data.autoProvision" label="Auto-provision">
      <SelectInput v-model="config.autoProvisionStoreId" :options="storeOptions" />
    </Active>
  </form>
</template>
