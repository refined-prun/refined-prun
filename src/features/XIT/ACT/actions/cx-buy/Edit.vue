<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import Commands from '@src/components/forms/Commands.vue';
import PrunButton from '@src/components/PrunButton.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import RadioItem from '@src/components/forms/RadioItem.vue';
import { showTileOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import EditPriceLimits from '@src/features/XIT/ACT/actions/cx-buy/EditPriceLimits.vue';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

const { action, pkg } = defineProps<{
  action: UserData.ActionData;
  pkg: UserData.ActionPackageData;
}>();

const materialGroups = computed(() => pkg.groups.map(x => x.name!).filter(x => x));
const materialGroup = ref(action.group ?? materialGroups.value[0]);

const exchanges = ['AI1', 'CI1', 'IC1', 'NC1', 'CI2', 'NC2'];
const exchange = ref(action.exchange ?? exchanges[0]);

const priceLimits = ref(getPriceLimits());

function getPriceLimits() {
  const priceLimits = action.priceLimits ?? {};
  return Object.keys(priceLimits).map(x => [x, priceLimits[x]]) as [string, number][];
}

const buyPartial = ref(action.buyPartial ?? false);

const useCXInv = ref(action.useCXInv ?? true);

function onEditPriceLimitsClick(e: Event) {
  showTileOverlay(e, EditPriceLimits, reactive({ priceLimits }));
}

function validate() {
  return true;
}

function save() {
  action.group = materialGroup.value;
  action.exchange = exchange.value;
  action.priceLimits = {};
  for (let [ticker, price] of priceLimits.value) {
    const material = materialsStore.getByTicker(ticker);
    if (!material || price === 0 || !isFinite(price)) {
      continue;
    }
    action.priceLimits[material.ticker] = price;
  }
  action.buyPartial = buyPartial.value;
  action.useCXInv = useCXInv.value;
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
  <Commands label="Price Limits">
    <PrunButton primary @click="onEditPriceLimitsClick">EDIT</PrunButton>
  </Commands>
  <Active
    label="Buy Partial"
    tooltip="Whether the action will be taken if there is not enough stock on the CX.">
    <RadioItem v-model="buyPartial">buy partial</RadioItem>
  </Active>
  <Active
    label="Use CX Inventory"
    tooltip="Whether to use stock in the CX warehouse when calculating how much needs to be bought.">
    <RadioItem v-model="useCXInv">use cx inventory</RadioItem>
  </Active>
</template>
