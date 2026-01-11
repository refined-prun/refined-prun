<script setup lang="ts">
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { PlanetBurn } from '@src/core/burn';
import { sortMaterials } from '@src/core/sort-materials';
import ProductionRow from './ProductionRow.vue';
import { PlanetProduction, PlatformProduction } from '@src/core/production';
import { useTileState } from './tile-state';
const { production, headers } = defineProps<{ production: PlanetProduction; headers?: boolean }>();

const displayproduction = useTileState('production');
const queue = useTileState('queue');
const inactive = useTileState('inactive');
const notqueued = useTileState('notqueued');

const filteredproduction = computed<PlatformProduction[]>(() => {
  if (!production) {
    return [];
  }

  return production.production
    .filter(x => x !== undefined)
    .sort((a, b) => {
      return b.capacity - a.capacity;
    })
    .filter(p => {
      const productionLines = p;
      if (productionLines.activeCapacity > 0 && displayproduction.value) {
        return true;
      }
      if (productionLines.inactiveCapacity > 0 && inactive.value) {
        return true;
      }
      if (productionLines.queuedOrders.length > 0 && queue.value) {
        return true;
      }
      if (productionLines.queuedOrders.length == 0 && notqueued.value) {
        return true;
      }

      return false;
    });
});
</script>

<template>
  <ProductionRow
    v-for="line in filteredproduction"
    :key="line.id"
    :production-line="line"
    :headers="headers" />
</template>
