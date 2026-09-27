<script setup lang="ts">
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { getPlanetStock } from '@src/core/stock';
import StockSection from '@src/features/XIT/STOCK/StockSection.vue';
import { useTileState } from '@src/features/XIT/STOCK/tile-state';

const { preset } = defineProps<{ preset: UserData.StockPresetData }>();

const ready = computed(() => sitesStore.fetched.value && storagesStore.fetched.value);
const sections = computed(() => {
  if (!ready.value) {
    return undefined;
  }
  return preset.planets.map(getPlanetStock);
});

const canMinimize = computed(() => (sections.value?.length ?? 0) > 1);

const expand = useTileState('expand');
const anyExpanded = computed(() => expand.value.length > 0);

function onExpandAllClick() {
  if (expand.value.length > 0) {
    expand.value = [];
  } else {
    expand.value = sections.value?.map(s => s.naturalId || s.planet) ?? [];
  }
}

function paramName(name: string) {
  return name.split(' ').join('_');
}
</script>

<template>
  <LoadingSpinner v-if="sections === undefined" />
  <div v-else-if="preset.planets.length === 0" :class="$style.empty">
    <div>This preset has no planets yet.</div>
    <PrunButton primary @click="showBuffer(`XIT STOCK_EDIT_${paramName(preset.name)}`)">
      CONFIGURE
    </PrunButton>
  </div>
  <table v-else>
    <thead>
      <tr>
        <th v-if="canMinimize" :class="$style.expand" @click="onExpandAllClick">
          {{ anyExpanded ? '-' : '+' }}
        </th>
        <th v-else />
        <th>Stock</th>
        <th>%</th>
        <th>Days</th>
      </tr>
    </thead>
    <StockSection
      v-for="section in sections"
      :key="section.naturalId || section.planet"
      :section="section"
      :can-minimize="canMinimize" />
  </table>
</template>

<style module>
.empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem;
}

.expand {
  text-align: center;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  padding-left: 18px;
  font-weight: bold;
}
</style>
