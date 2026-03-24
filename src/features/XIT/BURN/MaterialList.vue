<script setup lang="ts">
import { PlanetBurn } from '@src/core/burn';
import MaterialRow from '@src/features/XIT/BURN/MaterialRow.vue';
import { getSortedTickers } from '@src/features/XIT/BURN/utils';

const { burn } = defineProps<{ burn: PlanetBurn }>();

const sorted = computed(() => getSortedTickers(burn));
</script>

<template>
  <MaterialRow
    v-for="material in sorted"
    :key="material.id"
    :burn="burn.burn[material.ticker]"
    :material="material" />
</template>
