<script setup lang="ts">
import CopyButton from '@src/components/CopyButton.vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import FlowRow from '@src/features/XIT/FLOW/FlowRow.vue';
import SortHeader from '@src/features/XIT/FLOW/SortHeader.vue';
import { useTileState } from '@src/features/XIT/FLOW/tile-state';
import { getMaterialFlow, MaterialFlow, PlanetContribution } from '@src/core/flow';
import { convertToPlanetNaturalId } from '@src/core/planet-natural-id';
import { compareMaterials } from '@src/core/sort-materials';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { findWithQuery } from '@src/utils/find-with-query';

const parameters = useXitParameters();

const sites = computed(() => {
  const allSites = sitesStore.all.value;
  if (!allSites) {
    return undefined;
  }
  if (parameters.length === 0) {
    return allSites;
  }

  const result = findWithQuery(parameters, findSites);
  let matches = result.includeAll ? allSites : result.include;
  if (result.excludeAll) {
    matches = [];
  }
  return matches.filter(x => !result.exclude.has(x));
});

function findSites(term: string, parts: string[]) {
  if (term === 'all') {
    return sitesStore.all.value;
  }

  const naturalId = convertToPlanetNaturalId(term, parts);
  return sitesStore.getByPlanetNaturalId(naturalId);
}

const flows = computed(() => (sites.value ? getMaterialFlow(sites.value) : undefined));

const sort = useTileState('sort');
const desc = useTileState('desc');

const sorted = computed(() => {
  if (!flows.value) {
    return undefined;
  }

  const key = sort.value;
  const direction = desc.value ? -1 : 1;
  return flows.value.slice().sort((a, b) => {
    // Unpriced rows always go last.
    const aUnpriced = a.currencyDelta === undefined;
    const bUnpriced = b.currencyDelta === undefined;
    if (aUnpriced !== bUnpriced) {
      return aUnpriced ? 1 : -1;
    }
    // Same category-then-ticker order as XIT BURN.
    const byMaterial = compareMaterials(
      materialsStore.getByTicker(a.ticker),
      materialsStore.getByTicker(b.ticker),
    );
    if (key === 'ticker') {
      return byMaterial * direction;
    }
    const diff = (a[key] ?? 0) - (b[key] ?? 0);
    return diff === 0 ? byMaterial : diff * direction;
  });
});

function formatFlowTable(rows: MaterialFlow[]) {
  const round = (x: number) => Math.round(x * 1000) / 1000;
  const planets = (contributions: PlanetContribution[]) =>
    contributions.map(x => `${x.planetName} (${x.naturalId}): ${round(x.amount)}`).join('; ');
  const lines = ['Ticker\tProduction\tConsumption\tDelta\tValue\tProducers\tConsumers'];
  for (const flow of rows) {
    const value = flow.currencyDelta === undefined ? '' : round(flow.currencyDelta);
    lines.push(
      [
        flow.ticker,
        round(flow.production),
        round(flow.consumption),
        round(flow.delta),
        value,
        planets(flow.producers),
        planets(flow.consumers),
      ].join('\t'),
    );
  }
  return lines.join('\n');
}

function copyFlowTable() {
  return sorted.value ? formatFlowTable(sorted.value) : '';
}
</script>

<template>
  <LoadingSpinner v-if="sorted === undefined" />
  <template v-else>
    <div :class="C.ComExOrdersPanel.filter">
      <div :class="$style.spacer" />
      <CopyButton :copy-fn="copyFlowTable" data-tooltip-position="bottom" />
    </div>
    <table :class="$style.table">
      <thead>
        <tr>
          <SortHeader sort-key="ticker">Ticker</SortHeader>
          <SortHeader sort-key="delta">Delta</SortHeader>
          <SortHeader sort-key="production">Prod</SortHeader>
          <SortHeader sort-key="consumption">Cons</SortHeader>
          <SortHeader sort-key="currencyDelta">Value</SortHeader>
          <th>Producers</th>
          <th>Consumers</th>
        </tr>
      </thead>
      <tbody>
        <FlowRow v-for="flow in sorted" :key="flow.ticker" :flow="flow" />
      </tbody>
    </table>
  </template>
</template>

<style module>
.spacer {
  flex: 1;
}

.table tr > :nth-child(n + 2):nth-child(-n + 5) {
  text-align: right;
}

.table th {
  position: sticky;
  top: 0;
  background-color: #222222;
  z-index: 1;
}
</style>
