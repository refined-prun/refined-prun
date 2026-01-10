<script setup lang="ts">
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { PlanetBurn } from '@src/core/burn';
import { sortMaterials } from '@src/core/sort-materials';
import ProductionRow from './ProductionRow.vue';
import { PlanetProduction } from '@src/core/production';
const { production, headers } = defineProps<{ production: PlanetProduction; headers?: boolean }>();
</script>

<template>
  <ProductionRow
    v-for="line in production.production"
    :key="line.id"
    :production-line="line"
    :headers="headers" />
</template>
