<script setup lang="ts">
import { PlanetBurn } from '@src/core/burn';
import MaterialRow from '@src/features/XIT/BURN/MaterialRow.vue';
import { getSortedTickers } from '@src/features/XIT/BURN/utils';
import { useTileState } from '@src/features/XIT/BURN/tile-state';

const { burn } = defineProps<{ burn: PlanetBurn }>();

const sortBy = useTileState('sortBy');
const sortDesc = useTileState('sortDesc');

const sorted = computed(() => getSortedTickers(burn, sortBy.value, sortDesc.value));
</script>

<template>
  <MaterialRow
    v-for="material in sorted"
    :key="material.id"
    :burn="burn.burn[material.ticker]"
    :material="material"
    :natural-id="burn.naturalId" />
</template>
