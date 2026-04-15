<script setup lang="ts">
import { BaseStorageAnalysis, getBaseStorageAnalysis } from '@src/core/storage-analysis';
import BaseHeader from '@src/features/XIT/STO/BaseHeader.vue';
import BaseSection from '@src/features/XIT/STO/BaseSection.vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { useTileState } from '@src/features/XIT/STO/tile-state';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { comparePlanets } from '@src/util';

// Fake sample used by the invisible reference row that sets column widths.
const fakeAnalysis: BaseStorageAnalysis = {
  siteId: '',
  storeId: '',
  planetName: 'Placeholder',
  naturalId: '',
  weightCapacity: 1,
  weightLoad: 0.5,
  volumeCapacity: 1,
  volumeLoad: 0.5,
  importWeight: 0,
  importVolume: 0,
  exportWeight: 0,
  exportVolume: 0,
  fillPercentWeight: 0.5,
  fillPercentVolume: 0.5,
  fillPercentWeightNoInf: 0.5,
  fillPercentVolumeNoInf: 0.5,
  needFillPercentWeight: 0.5,
  needFillPercentVolume: 0.5,
  needFillRatio: 0.5,
  daysUntilFull: 10,
  bindingLimit: 't',
};

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
        <th
          data-tooltip="Share of storage currently occupied (worst of weight vs volume)."
          data-tooltip-position="bottom"
          >Current Fill</th
        >
        <th
          data-tooltip="Current fill if you excluded produced goods that accumulate until shipped out."
          data-tooltip-position="bottom"
          >Fill w/o Produced</th
        >
        <th
          data-tooltip="Projected fill if every consumed material were delivered up to the Need amount shown in XIT BURN. Colored green/yellow/red by headroom."
          data-tooltip-position="bottom"
          >Fill After Resupply</th
        >
        <th
          data-tooltip="Days until storage fills at the current net production rate."
          data-tooltip-position="bottom"
          >Days</th
        >
        <th
          data-tooltip="Which dimension (weight or volume) would fill first."
          data-tooltip-position="bottom"
          >Limit</th
        >
        <th>CMD</th>
      </tr>
    </thead>
    <tbody :class="$style.fakeRow">
      <BaseHeader :analysis="fakeAnalysis" :on-click="() => {}" />
    </tbody>
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

.fakeRow {
  visibility: collapse;
}
</style>
