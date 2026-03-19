<script setup lang="ts">
import ProductionRow from './ProductionRow.vue';
import { PlanetProduction, PlatformProduction } from '@src/core/production';
import { useTileState } from './tile-state';
const { production, headers } = defineProps<{ production: PlanetProduction; headers?: boolean }>();

const displayProduction = useTileState('production');
const queue = useTileState('queue');
const inactive = useTileState('inactive');
const notqueued = useTileState('notqueued');

const filteredProduction = computed<PlatformProduction[]>(() => {
  return production.production
    .filter(x => x !== undefined)
    .sort((a, b) => {
      return b.capacity - a.capacity;
    })
    .filter(p => {
      const productionLines = p;
      if (productionLines.activeCapacity > 0 && displayProduction.value) {
        return true;
      }
      if (productionLines.inactiveCapacity > 0 && inactive.value) {
        return true;
      }
      if (productionLines.queuedOrders.length > 0 && queue.value) {
        return true;
      }
      if (productionLines.queuedOrders.length === 0 && notqueued.value) {
        return true;
      }

      return false;
    });
});
</script>

<template>
  <ProductionRow
    v-for="line in filteredProduction"
    :key="line.id"
    :production-line="line"
    :headers="headers" />
</template>
