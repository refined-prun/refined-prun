<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import Passive from '@src/components/forms/Passive.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import { Config } from '@src/features/XIT/ACT/actions/cont-ship/config';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { comparePlanets } from '@src/util';
import { configurableValue, groupTargetPrefix } from '@src/features/XIT/ACT/shared-types';

const { data, config } = defineProps<{ data: UserData.ActionData; config: Config }>();

const locations = computed(() => {
  const seen = new Set<string>();
  const result: string[] = [];
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
    if (name && !seen.has(name)) {
      seen.add(name);
      result.push(name);
    }
  }
  return result.sort(comparePlanets);
});

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

function displayValue(value: string | undefined) {
  if (!value) {
    return '--';
  }
  if (value.startsWith(groupTargetPrefix)) {
    return `[${value.slice(groupTargetPrefix.length)}] target`;
  }
  return value;
}
</script>

<template>
  <form>
    <Active v-if="data.contOrigin === configurableValue" label="From">
      <SelectInput v-model="config.origin" :options="locations" />
    </Active>
    <Passive v-else label="From">
      <span>{{ displayValue(data.contOrigin) }}</span>
    </Passive>
    <Active v-if="data.contDest === configurableValue" label="To">
      <SelectInput v-model="config.destination" :options="locations" />
    </Active>
    <Passive v-else label="To">
      <span>{{ displayValue(data.contDest) }}</span>
    </Passive>
  </form>
</template>
