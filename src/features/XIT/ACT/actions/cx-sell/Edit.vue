<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import Commands from '@src/components/forms/Commands.vue';
import PrunButton from '@src/components/PrunButton.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import RadioItem from '@src/components/forms/RadioItem.vue';
import { showTileOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import EditPriceLimits from '@src/features/XIT/ACT/actions/cx-buy/EditPriceLimits.vue';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { exchangesStore } from '@src/infrastructure/prun-api/data/exchanges';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import {
  atSameLocation,
  serializeStorage,
  storageSort,
} from '@src/features/XIT/ACT/actions/utils';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';

const { action, pkg } = defineProps<{
  action: UserData.ActionData;
  pkg: UserData.ActionPackageData;
}>();

const materialGroups = computed(() => pkg.groups.map(x => x.name!).filter(x => x));
const materialGroup = ref(action.group ?? materialGroups.value[0]);

const exchanges = ['AI1', 'CI1', 'IC1', 'NC1', 'CI2', 'NC2'];
const exchange = ref(action.exchange ?? exchanges[0]);

const cxWarehouse = computed(() => {
  const naturalId = exchangesStore.getNaturalIdFromCode(exchange.value);
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
    .sort(storageSort)
    .map(serializeStorage);
});

const originOptions = computed(() => {
  const options = [...originStorages.value];
  options.unshift(configurableValue);
  return options;
});

const origin = ref(action.origin ?? originStorages.value[0] ?? originOptions.value[0]);

watchEffect(() => {
  if (origin.value === configurableValue) {
    return;
  }

  if (!originStorages.value.includes(origin.value)) {
    origin.value = originStorages.value[0] ?? configurableValue;
  }
});

const priceLimits = ref(getPriceLimits());

function getPriceLimits() {
  const priceLimits = action.priceLimits ?? {};
  return Object.keys(priceLimits).map(x => [x, priceLimits[x]]) as [string, number][];
}

const sellPartial = ref(action.sellPartial ?? false);

const allowUnfilled = ref(action.allowUnfilled ?? false);

function onEditPriceLimitsClick(e: Event) {
  showTileOverlay(e, EditPriceLimits, reactive({ priceLimits }));
}

function validate() {
  return true;
}

function save() {
  action.group = materialGroup.value;
  action.exchange = exchange.value;
  action.origin = origin.value;
  action.priceLimits = {};
  for (let [ticker, price] of priceLimits.value) {
    const material = materialsStore.getByTicker(ticker);
    if (!material || price === 0 || !isFinite(price)) {
      continue;
    }
    action.priceLimits[material.ticker] = price;
  }
  action.sellPartial = sellPartial.value;
  action.allowUnfilled = allowUnfilled.value;
}

defineExpose({ validate, save });
</script>

<template>
  <Active label="Material Group">
    <SelectInput v-model="materialGroup" :options="materialGroups" />
  </Active>
  <Active label="Exchange">
    <SelectInput v-model="exchange" :options="exchanges" />
  </Active>
  <Active label="Origin">
    <SelectInput v-model="origin" :options="originOptions" />
  </Active>
  <Commands label="Price Limits">
    <PrunButton primary @click="onEditPriceLimitsClick">EDIT</PrunButton>
  </Commands>
  <Active
    label="Sell Partial"
    tooltip="Whether the action will be taken if there is not enough demand on the CX.">
    <RadioItem v-model="sellPartial">sell partial</RadioItem>
  </Active>
  <Active
    label="Allow Unfilled"
    tooltip="Create a full ask order even if there is not enough demand on the CX.">
    <RadioItem v-model="allowUnfilled">allow unfilled</RadioItem>
  </Active>
</template>
