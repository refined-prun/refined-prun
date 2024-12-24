<script setup lang="ts">
import PrunLink from '@src/components/PrunLink.vue';

const { address } = defineProps<{ address: PrunApi.Address }>();

const body = computed(() => address.lines[1]);
const isPlanet = computed(() => body.value.type === 'PLANET');
const naturalId = computed(() => body.value.entity.naturalId);
const name = computed(() => body.value.entity.name);
</script>

<template>
  <PrunLink v-if="isPlanet" inline :command="`PLI ${naturalId}`">{{ name }}</PrunLink>
  <PrunLink v-else inline :command="`STNS ${naturalId}`">{{ name }}</PrunLink>
</template>
