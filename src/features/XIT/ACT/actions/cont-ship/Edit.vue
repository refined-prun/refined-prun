<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import NumericInput from '@src/components/forms/NumericInput.vue';
import RadioItem from '@src/components/forms/RadioItem.vue';
import { configurableValue, groupTargetPrefix } from '@src/features/XIT/ACT/shared-types';
import { useContLocations } from '@src/features/XIT/ACT/actions/cont-locations';
import { balancesStore } from '@src/infrastructure/prun-api/data/balances';

const { action, pkg } = defineProps<{
  action: UserData.ActionData;
  pkg: UserData.ActionPackageData;
}>();

const materialGroups = computed(() => pkg.groups.map(x => x.name!).filter(x => x));
const materialGroup = ref(action.group ?? materialGroups.value[0]);

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

const contOrigin = ref(action.contOrigin ?? staticLocations.value[0] ?? '');
const contDest = ref(action.contDest ?? staticLocations.value[0] ?? '');
const currency = ref(action.currency ?? 'NCC');
const paymentPerTon = ref(action.paymentPerTon ?? 0);
const daysToFulfill = ref(action.daysToFulfill ?? 3);
const autoProvision = ref(action.autoProvision ?? false);

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
  action.autoProvision = autoProvision.value;
  delete action.contractNote;
}

defineExpose({ validate, save });
</script>

<template>
  <Active label="Material Group">
    <SelectInput v-model="materialGroup" :options="materialGroups" />
  </Active>

  <Active label="Origin">
    <SelectInput v-model="contOrigin" :options="locationOptions" />
  </Active>

  <Active label="Destination">
    <SelectInput v-model="contDest" :options="locationOptions" />
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

  <Active label="Auto-provision">
    <RadioItem v-model="autoProvision">enable auto-provision</RadioItem>
  </Active>
</template>
