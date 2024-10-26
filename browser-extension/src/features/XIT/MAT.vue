<script lang="ts">
import xit from '@src/features/XIT/xit-registry.js';
import MAT from '@src/features/XIT/MAT.vue';

xit.add({
  command: 'MAT',
  name: 'MATERIAL PALETTE',
  component: () => MAT,
});

export default {};
</script>

<script setup lang="ts">
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import GridMaterialIcon from '@src/components/GridMaterialIcon.vue';
</script>

<template>
  <div :class="PrunCss.InventoryView.grid">
    <GridMaterialIcon v-for="mat in materialsStore.all.value" :key="mat.id" :ticker="mat.ticker" />
  </div>
</template>
