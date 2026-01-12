<script setup lang="ts">
import RadioItem from '@src/components/forms/RadioItem.vue';
import { getPlanetProduction, PlanetProduction } from '@src/core/production';
import ProdSection from './ProdSection.vue';
import { useTileState } from './tile-state';
import Tooltip from '@src/components/Tooltip.vue';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import InlineFlex from '@src/components/InlineFlex.vue';
import { findWithQuery } from '@src/utils/find-with-query';
import { convertToPlanetNaturalId } from '@src/core/planet-natural-id';

const parameters = useXitParameters();

// Fake site for overall burn.
const overall: PrunApi.Site = {} as PrunApi.Site;
export interface SiteData {
  sites: PrunApi.Site[];
  includeOverall: boolean;
  overallOnly: boolean;
}

const sites = computed<SiteData | undefined>(() => {
  if (!sitesStore.all.value) {
    return undefined;
  }

  const allSites = sitesStore.all.value;
  if (parameters.length === 0) {
    return {
      sites: allSites,
      includeOverall: true,
      overallOnly: false,
    };
  }
  const result = findWithQuery(parameters, findSites);
  let matches = result.include;
  if (result.includeAll) {
    matches = allSites;
  }
  if (result.excludeAll) {
    matches = [];
  }
  matches = matches.filter(x => !result.exclude.has(x));
  const nonOverallMatches = matches.filter(x => x !== overall);
  const overallIncluded =
    nonOverallMatches.length > 1 ||
    matches.length !== nonOverallMatches.length ||
    result.includeAll;
  const overallExcluded = result.exclude.has(overall) || result.excludeAll;

  let includeOverall = overallIncluded && !overallExcluded;
  let overallOnly = false;
  let overallOnlySites = allSites;
  if (matches.length === 1 && matches[0] === overall && !overallExcluded) {
    // `XIT BURN OVERALL`,
    overallOnlySites = allSites.filter(x => !result.exclude.has(x));
    includeOverall = true;
    overallOnly = true;
  }

  return {
    sites: overallOnly ? overallOnlySites : nonOverallMatches,
    includeOverall,
    overallOnly,
  };
});

function findSites(term: string, parts: string[]) {
  if (term === 'all') {
    return sitesStore.all.value;
  }

  if (term === 'overall') {
    return overall;
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
  if (!sites.value) {
    return [];
  }

  return sites.value.sites
    .filter(site => site !== overall)
    .map(site => {
      return getPlanetProduction(site);
    })
    .filter(x => x !== undefined)
    .sort((a, b) => {
      // Sum up capacity for planet A
      const totalCapacityA = a.production.reduce((sum, p) => sum + p.capacity, 0);

      // Sum up capacity for planet B
      const totalCapacityB = b.production.reduce((sum, p) => sum + p.capacity, 0);

      // Descending order (highest capacity first)
      return totalCapacityB - totalCapacityA;
    })
    .filter(p => {
      const productionLines = p.production;
      if (
        productionLines.reduce((sum, line) => sum + line.activeCapacity, 0) > 0 &&
        displayProduction.value
      ) {
        return true;
      }
      if (
        productionLines.reduce((sum, line) => sum + line.inactiveCapacity, 0) > 0 &&
        inactive.value
      ) {
        return true;
      }
      if (
        productionLines.reduce((sum, line) => sum + line.queuedOrders.length, 0) > 0 &&
        queue.value
      ) {
        return true;
      }
      if (
        productionLines.reduce((sum, line) => sum + line.queuedOrders.length, 0) == 0 &&
        notqueued.value
      ) {
        return true;
      }

      return false;
    });
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
  <table :class="[$style.fixedWidthTable]">
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

        <th>
          <InlineFlex>
            Efficiency
            <Tooltip position="bottom" tooltip="How much of a material is consumed per day." />
          </InlineFlex>
        </th>

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

<style module>
.fixed-width-table {
  /* Forces the browser to use the specified widths and ignore content size */
  table-layout: fixed;
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
