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

const parameters = useXitParameters();

function findSites(term: string, parts: string[]) {
  if (term === 'all') {
    return sitesStore.all.value;
  }

  const naturalId = convertToPlanetNaturalId(term, parts);
  return sitesStore.getByPlanetNaturalId(naturalId);
}

const displayProduction = useTileState('production');
const queue = useTileState('queue');
const inactive = useTileState('inactive');
const notqueued = useTileState('notqueued');
const headers = useTileState('headers');

const planetProduction = computed<PlanetProduction[]>(() => {
  let sites = findWithQuery(parameters, findSites).include;
  if (sites.length === 0) {
    sites = sitesStore.all.value ?? [];
  }

  return sites
    .map(x => getPlanetProduction(x))
    .filter(x => x !== undefined)
    .sort((a, b) => {
      // Sum up capacity for planet A
      const totalCapacityA = a.production.reduce((sum, p) => sum + p.capacity, 0);

      // Sum up capacity for planet B
      const totalCapacityB = b.production.reduce((sum, p) => sum + p.capacity, 0);

      // Descending order (highest capacity first)
      return totalCapacityB - totalCapacityA;
    })
    .filter(p =>
      matchesProductionFilter(p.production, {
        production: displayProduction.value,
        inactive: inactive.value,
        queue: queue.value,
        notQueued: notqueued.value,
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
    <RadioItem v-model="notqueued" horizontal>Not Queued</RadioItem>
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
