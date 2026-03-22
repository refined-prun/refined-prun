<script setup lang="ts">
import ProductionRow from './ProductionRow.vue';
import { PlanetProduction } from '@src/core/production';
import { useTileState } from './tile-state';
import { matchesProductionFilter } from './utils';
const { production, headers } = defineProps<{ production: PlanetProduction; headers?: boolean }>();

const displayProduction = useTileState('production');
const queue = useTileState('queue');
const inactive = useTileState('inactive');
const notqueued = useTileState('notqueued');

const filteredProduction = computed(() => {
  return production.production
    .sort((a, b) => b.capacity - a.capacity)
    .filter(p =>
      matchesProductionFilter(p, {
        production: displayProduction.value,
        inactive: inactive.value,
        queue: queue.value,
        notQueued: notqueued.value,
      }),
    );
});
</script>

<template>
  <ProductionRow
    v-for="line in filteredProduction"
    :key="line.id"
    :production-line="line"
    :headers="headers" />
</template>
