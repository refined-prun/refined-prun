<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import NumericInput from '@src/components/forms/NumericInput.vue';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { comparePlanets } from '@src/util';

const { action, pkg } = defineProps<{
  action: UserData.ActionData;
  pkg: UserData.ActionPackageData;
}>();

const materialGroups = computed(() => pkg.groups.map(x => x.name!).filter(x => x));
const materialGroup = ref(action.group ?? materialGroups.value[0]);

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

const currencies = ['NCC', 'CIS', 'AIC', 'ICA'];

const contOrigin = ref(action.contOrigin ?? locations.value[0] ?? '');
const contDest = ref(action.contDest ?? locations.value[0] ?? '');
const currency = ref(action.currency ?? 'NCC');
const paymentPerTon = ref(action.paymentPerTon ?? 0);
const daysToFulfill = ref(action.daysToFulfill ?? 3);

function validate() {
  if (!materialGroup.value) {
    return false;
  }
  if (daysToFulfill.value < 1) {
    return false;
  }
  if (paymentPerTon.value < 0) {
    return false;
  }
  return true;
}

function save() {
  action.group = materialGroup.value;
  action.contOrigin = contOrigin.value;
  action.contDest = contDest.value;
  action.currency = currency.value;
  action.paymentPerTon = paymentPerTon.value;
  action.daysToFulfill = daysToFulfill.value;
  delete action.contractNote;
}

defineExpose({ validate, save });
</script>

<template>
  <Active label="Material Group">
    <SelectInput v-model="materialGroup" :options="materialGroups" />
  </Active>

  <Active label="Origin">
    <SelectInput v-model="contOrigin" :options="locations" />
  </Active>

  <Active label="Destination">
    <SelectInput v-model="contDest" :options="locations" />
  </Active>

  <Active label="Currency">
    <SelectInput v-model="currency" :options="currencies" />
  </Active>

  <Active label="Payment per Ton">
    <NumericInput v-model="paymentPerTon" :min="0" :step="1" placeholder="0" />
  </Active>

  <Active label="Days to Fulfill">
    <NumericInput v-model="daysToFulfill" :min="1" :max="30" :step="1" />
  </Active>
</template>
