<script setup lang="ts">
import PrunLink from '@src/components/PrunLink.vue';
import { getAddressName, isPlanetLine } from '@src/infrastructure/prun-api/data/addresses';

const { address } = defineProps<{ address: PrunApi.Address }>();

const body = computed(() => address.lines[1]);
const isPlanet = computed(() => isPlanetLine(body.value));
const naturalId = computed(() => body.value.entity?.naturalId);
const name = computed(() => getAddressName(address));
</script>

<template>
  <PrunLink v-if="isPlanet" inline :command="`PLI ${naturalId}`">{{ name }}</PrunLink>
  <PrunLink v-else inline :command="`STNS ${naturalId}`">{{ name }}</PrunLink>
</template>
