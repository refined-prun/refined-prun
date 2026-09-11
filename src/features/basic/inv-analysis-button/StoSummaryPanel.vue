<script setup lang="ts">
import { getBaseStorageAnalysis } from '@src/core/storage-analysis';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import BaseHeader from '@src/features/XIT/STO/BaseHeader.vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';

const { naturalId, onExpand } = defineProps<{
  naturalId: string;
  onExpand: () => void;
}>();

const site = computed(() => sitesStore.getByPlanetNaturalIdOrName(naturalId));
const analysis = computed(() => getBaseStorageAnalysis(site.value));
const ready = computed(() => !!sitesStore.fetched.value);
</script>

<template>
  <div :class="$style.panel">
    <table v-if="analysis" :class="$style.table">
      <tbody>
        <BaseHeader
          :analysis="analysis"
          has-minimize
          :minimized="true"
          :on-click="onExpand"
          tooltip-position="top"
          hide-buttons
          show-column-tooltips
          planet-only-click />
      </tbody>
    </table>
    <LoadingSpinner v-else-if="!ready" />
    <div v-else :class="$style.empty">No storage data for {{ naturalId }}</div>
  </div>
</template>

<style module>
.panel {
  border-top: 1px solid #2b485a;
  flex-shrink: 0;
}

.table {
  width: 100%;
}

.empty {
  padding: 4px 8px;
  font-size: 11px;
  font-style: italic;
  opacity: 0.7;
}
</style>
