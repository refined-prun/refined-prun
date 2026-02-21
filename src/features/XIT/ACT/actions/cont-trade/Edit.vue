<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import NumericInput from '@src/components/forms/NumericInput.vue';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { comparePlanets } from '@src/util';
import { configurableValue, groupTargetPrefix } from '@src/features/XIT/ACT/shared-types';

const { action, pkg } = defineProps<{
  action: UserData.ActionData;
  pkg: UserData.ActionPackageData;
}>();

const materialGroups = computed(() => pkg.groups.map(x => x.name!).filter(x => x));
const materialGroup = ref(action.group ?? materialGroups.value[0]);

const tradeTypes = ['Buy', 'Sell'];
const tradeTypeToValue: Record<string, 'BUYING' | 'SELLING'> = {
  Buy: 'BUYING',
  Sell: 'SELLING',
};
const valueToTradeType: Record<string, string> = {
  BUYING: 'Buy',
  SELLING: 'Sell',
};

const tradeType = ref(valueToTradeType[action.contTradeType ?? 'BUYING'] ?? 'Buy');

const staticLocations = computed(() => {
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

const groupTargetOptions = computed(() =>
  pkg.groups
    .filter(x => x.name)
    .map(x => ({
      label: `[${x.name}] target`,
      value: `${groupTargetPrefix}${x.name}`,
    })),
);

const locationOptions = computed(() => [
  configurableValue,
  ...groupTargetOptions.value,
  ...staticLocations.value,
]);

const currencies = ['NCC', 'CIS', 'AIC', 'ICA'];

const contLocation = ref(action.contLocation ?? staticLocations.value[0] ?? '');
const currency = ref(action.currency ?? 'NCC');
const daysToFulfill = ref(action.daysToFulfill ?? 3);

function validate() {
  if (!materialGroup.value) {
    return false;
  }
  if (daysToFulfill.value < 1) {
    return false;
  }
  return true;
}

function save() {
  action.group = materialGroup.value;
  action.contTradeType = tradeTypeToValue[tradeType.value];
  action.contLocation = contLocation.value;
  action.currency = currency.value;
  action.daysToFulfill = daysToFulfill.value;
}

defineExpose({ validate, save });
</script>

<template>
  <Active label="Material Group">
    <SelectInput v-model="materialGroup" :options="materialGroups" />
  </Active>

  <Active label="Trade Type">
    <SelectInput v-model="tradeType" :options="tradeTypes" />
  </Active>

  <Active label="Location">
    <SelectInput v-model="contLocation" :options="locationOptions" />
  </Active>

  <Active label="Currency">
    <SelectInput v-model="currency" :options="currencies" />
  </Active>

  <Active label="Days to Fulfill">
    <NumericInput v-model="daysToFulfill" :min="1" :max="30" :step="1" />
  </Active>
</template>
