<script setup lang="ts">
import RadioItem from '@src/components/forms/RadioItem.vue';
import { getPlanetProduction, PlanetProduction } from '@src/core/production';
import ProdSection from './ProdSection.vue';
import { useTileState } from './tile-state';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { findWithQuery } from '@src/utils/find-with-query';
import { convertToPlanetNaturalId } from '@src/core/planet-natural-id';
import { matchesProductionFilter } from './utils';
import { sumBy } from '@src/utils/sum-by';

const parameters = useXitParameters();

function findSites(term: string, parts: string[]) {
  if (term === 'all') {
    return sitesStore.all.value;
  }

  const naturalId = convertToPlanetNaturalId(term, parts);
  return sitesStore.getByPlanetNaturalId(naturalId);
}

function byTotalCapacityDesc(a: PlanetProduction, b: PlanetProduction) {
  return sumBy(b.production, x => x.capacity) - sumBy(a.production, x => x.capacity);
}

const displayProduction = useTileState('production');
const queue = useTileState('queue');
const inactive = useTileState('inactive');
const notQueued = useTileState('notQueued');
const headers = useTileState('headers');

const planetProduction = computed(() => {
  let sites = findWithQuery(parameters, findSites).include;
  if (sites.length === 0) {
    sites = sitesStore.all.value ?? [];
  }

  return sites
    .map(getPlanetProduction)
    .filter(x => x !== undefined)
    .sort(byTotalCapacityDesc)
    .filter(x =>
      matchesProductionFilter(x.production, {
        production: displayProduction.value,
        inactive: inactive.value,
        queue: queue.value,
        notQueued: notQueued.value,
      }),
    );
});
</script>

<template>
  <div :class="C.ComExOrdersPanel.filter">
    <RadioItem v-model="headers" horizontal>Headers</RadioItem>
    <RadioItem v-model="displayProduction" horizontal>Production</RadioItem>
    <RadioItem v-model="inactive" horizontal>Inactive</RadioItem>
    <RadioItem v-model="queue" horizontal>Queue</RadioItem>
    <RadioItem v-model="notQueued" horizontal>Not Queued</RadioItem>
  </div>
  <table>
    <colgroup>
      <col style="width: 32px" />
      <col />
      <col />
      <col />
      <col style="width: 65px" />
    </colgroup>
    <thead>
      <tr v-if="headers">
        <th> </th>
        <th>Planet</th>
        <th>Efficiency</th>
        <th>Slots</th>
        <th>CMD</th>
      </tr>
    </thead>
    <ProdSection
      v-for="production in planetProduction"
      :key="production.site.siteId"
      :can-minimize="planetProduction.length > 1"
      :production="production"
      :headers="headers" />
  </table>
</template>
