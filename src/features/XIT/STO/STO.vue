<script setup lang="ts">
import { BaseStorageAnalysis, getBaseStorageAnalysis } from '@src/core/storage-analysis';
import BaseSection from '@src/features/XIT/STO/BaseSection.vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { useTileState } from '@src/features/XIT/STO/tile-state';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { comparePlanets } from '@src/util';

const parameters = useXitParameters();
const expand = useTileState('expand');

const analyses = computed<BaseStorageAnalysis[] | undefined>(() => {
  if (!sitesStore.all.value) {
    return undefined;
  }
  let sites = sitesStore.all.value;
  if (parameters[0]) {
    const match = sitesStore.getByPlanetNaturalIdOrName(parameters[0]);
    sites = match ? [match] : [];
  }
  const result = sites.map(getBaseStorageAnalysis).filter((x): x is BaseStorageAnalysis => !!x);
  result.sort((a, b) => {
    if (a.daysUntilFull !== b.daysUntilFull) {
      return a.daysUntilFull - b.daysUntilFull;
    }
    return comparePlanets(a.naturalId, b.naturalId);
  });
  return result;
});

watchEffect(() => {
  if (parameters[0] && analyses.value?.length === 1) {
    const naturalId = analyses.value[0].naturalId;
    if (!expand.value.includes(naturalId)) {
      expand.value = [...expand.value, naturalId];
    }
  }
});

const noMatch = computed(
  () => !!parameters[0] && analyses.value !== undefined && analyses.value.length === 0,
);
</script>

<template>
  <LoadingSpinner v-if="analyses === undefined" />
  <div v-else-if="noMatch" :class="$style.empty">No base matches "{{ parameters[0] }}"</div>
  <div v-else-if="analyses.length === 0" :class="$style.empty">No bases yet</div>
  <table v-else>
    <thead>
      <tr>
        <th :class="$style.planet">Planet</th>
        <th>Fill</th>
        <th>Days</th>
        <th>Limit</th>
        <th>CMD</th>
      </tr>
    </thead>
    <BaseSection
      v-for="analysis in analyses"
      :key="analysis.siteId"
      can-minimize
      :analysis="analysis" />
  </table>
</template>

<style module>
.planet {
  text-align: left;
  padding-left: 26px;
}

.empty {
  padding: 1rem;
  font-style: italic;
  opacity: 0.7;
  text-align: center;
}
</style>
