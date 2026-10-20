<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';

const { action } = defineProps<{
  action: UserData.ActionData;
  pkg: UserData.ActionPackageData;
}>();

const ship = ref(action.ship ?? '');
const destination = ref(action.sfcDestination ?? '');
const ads = ref(action.adKeys?.join(' ') ?? '');
const shipError = ref(false);
const destinationError = ref(false);

function validate() {
  shipError.value = ship.value.trim().length === 0;
  destinationError.value = destination.value.trim().length === 0;
  return !shipError.value && !destinationError.value;
}

function save() {
  action.ship = ship.value.trim();
  action.sfcDestination = destination.value.trim();
  action.adKeys = ads.value.split(/\s+/).filter(x => x.length > 0);
}

defineExpose({ validate, save });
</script>

<template>
  <Active label="Ship" :error="shipError">
    <TextInput v-model="ship" placeholder="Registration" />
  </Active>
  <Active label="Destination" :error="destinationError">
    <TextInput v-model="destination" placeholder="Natural ID" />
  </Active>
  <Active label="Ads">
    <TextInput v-model="ads" placeholder="BEN/8036 BEN/8040" />
  </Active>
</template>
