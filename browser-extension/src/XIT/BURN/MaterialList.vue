<script setup lang="ts">
import { materialsStore, sortMaterials } from '@src/prun-api/data/materials';
import { computed, PropType } from 'vue';
import { PlanetBurn } from '@src/burn';
import MaterialRow from '@src/XIT/BURN/MaterialRow.vue';

const props = defineProps({
  isMultiplanet: Boolean,
  burn: {
    type: Object as PropType<PlanetBurn>,
    required: true,
  },
  dispSettings: {
    type: Object,
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
    :disp-settings="dispSettings"
    :burn="burn"
    :material="material"
    :is-multiplanet="isMultiplanet" />
</template>
