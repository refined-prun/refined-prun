<script setup lang="ts">
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { computed, PropType } from 'vue';
import { PlanetBurn } from '@src/core/burn';
import MaterialRow from '@src/features/XIT/BURN/MaterialRow.vue';
import { sortMaterials } from '@src/core/sort-materials';

const props = defineProps({
  isMultiplanet: Boolean,
  burn: {
    type: Object as PropType<PlanetBurn>,
    required: true,
  },
});

const materials = computed(() => Object.keys(props.burn.burn).map(materialsStore.getByTicker));
const sorted = computed(() => {
  const filtered = materials.value
    .slice()
    .filter(x => x)
    .map(x => x!);
  return sortMaterials(filtered);
});
</script>

<template>
  <MaterialRow
    v-for="material in sorted"
    :key="material.id"
    :burn="burn"
    :material="material"
    :is-multiplanet="isMultiplanet" />
</template>
