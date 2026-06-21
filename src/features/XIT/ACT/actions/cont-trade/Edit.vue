<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import NumericInput from '@src/components/forms/NumericInput.vue';
import { configurableValue, groupTargetPrefix } from '@src/features/XIT/ACT/shared-types';
import { useContLocations } from '@src/features/XIT/ACT/actions/cont-locations';
import { balancesStore } from '@src/infrastructure/prun-api/data/balances';

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

const staticLocations = useContLocations();

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

const currencies = computed(() => balancesStore.currencies.value ?? []);

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
