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
    .filter(x => x.name && x.planet)
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
const currency = ref(action.currency ?? 'AIC');
const paymentPerTon = ref(action.paymentPerTon ?? 0);
const daysToFulfill = ref(action.daysToFulfill ?? 3);
const autoProvision = ref(action.autoProvision ?? false);

function validate() {
  const locations = locationOptions.value.map(x => (typeof x === 'string' ? x : x.value));
  if (!locations.includes(contOrigin.value)) {
    return false;
  }
  if (!locations.includes(contDest.value)) {
    return false;
  }
  if (!materialGroup.value) {
    return false;
  }
  const days = Number(daysToFulfill.value);
  if (!Number.isInteger(days) || days < 1 || days > 99) {
    return false;
  }
  const payment = Number(paymentPerTon.value);
  if (String(paymentPerTon.value).trim() === '' || !Number.isFinite(payment) || payment < 0) {
    return false;
  }
  return true;
}

function save() {
  action.group = materialGroup.value;
  action.contOrigin = contOrigin.value;
  action.contDest = contDest.value;
  action.currency = currency.value;
  action.paymentPerTon = Number(paymentPerTon.value);
  action.daysToFulfill = Number(daysToFulfill.value);
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
    <NumericInput v-model="daysToFulfill" :min="1" :max="99" :step="1" />
  </Active>

  <Active label="Auto-provision">
    <RadioItem v-model="autoProvision">enable auto-provision</RadioItem>
  </Active>
</template>
