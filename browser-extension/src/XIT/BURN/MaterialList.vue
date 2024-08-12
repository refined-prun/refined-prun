<script setup lang="ts">
import usePrunSelector from '@src/hooks/use-prun-selector';
import { selectMaterialsByTickers, sortMaterials } from '@src/prun-api/data/materials';
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

const materials = usePrunSelector(s => selectMaterialsByTickers(s, Object.keys(props.burn.burn)));
const filtered = computed(() =>
  materials.value
    .slice()
    .filter(x => x)
    .map(x => x!),
);
const sorted = usePrunSelector(s => sortMaterials(s, filtered.value));
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
