<script setup lang="ts">
import CopyButton from '@src/components/CopyButton.vue';
import RadioItem from '@src/components/forms/RadioItem.vue';
import { getPlanetBurn, PlanetBurn } from '@src/core/burn';
import { comparePlanets } from '@src/util';
import BurnSection from '@src/features/XIT/MATIO/BurnSection.vue';
import { useTileState } from '@src/features/XIT/MATIO/tile-state';
import Tooltip from '@src/components/Tooltip.vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import MaterialRow from '@src/features/XIT/MATIO/MaterialRow.vue';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import {
  getSortedTickers,
  matchesMode,
  MatioMode,
  MatioRowBurn,
} from '@src/features/XIT/MATIO/utils';
import InlineFlex from '@src/components/InlineFlex.vue';
import { findWithQuery } from '@src/utils/find-with-query';
import { convertToPlanetNaturalId } from '@src/core/planet-natural-id';

const parameters = useXitParameters();

// Fake site for overall burn.
const overall: PrunApi.Site = {} as PrunApi.Site;

const queryResult = computed(() => {
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
    // `XIT MATIO OVERALL`,
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

const planetBurn = computed(() => {
  if (queryResult.value === undefined) {
    return undefined;
  }

  const filtered = queryResult.value.sites
    .filter(x => x !== overall)
    .map(getPlanetBurn)
    .filter(x => x !== undefined);
  if (filtered.length <= 1) {
    return filtered;
  }

  filtered.sort((a, b) => comparePlanets(a.naturalId, b.naturalId));

  const overallBurn: PlanetBurn['burn'] = {};
  for (const burn of filtered) {
    for (const mat of Object.keys(burn.burn)) {
      const materialBurn = burn.burn[mat];
      if (overallBurn[mat]) {
        overallBurn[mat].dailyAmount += materialBurn.dailyAmount;
        overallBurn[mat].inventory += materialBurn.inventory;
        overallBurn[mat].input += materialBurn.input;
        overallBurn[mat].output += materialBurn.output;
        overallBurn[mat].workforce += materialBurn.workforce;
      } else {
        overallBurn[mat] = {
          input: materialBurn.input,
          output: materialBurn.output,
          workforce: materialBurn.workforce,
          dailyAmount: materialBurn.dailyAmount,
          inventory: materialBurn.inventory,
          daysLeft: 0,
          type: 'output',
        };
      }
    }
  }

  const overallSection = { burn: overallBurn, planetName: 'Overall', naturalId: '', storeId: '' };
  if (queryResult.value.overallOnly) {
    return [overallSection];
  }

  if (queryResult.value.includeOverall) {
    filtered.push(overallSection);
  }
  return filtered;
});

const fakeBurn: MatioRowBurn = {
  inventory: 100000,
  input: 100000,
  output: 125000,
  dailyAmount: 25000,
  workforce: 0,
};

const rat = materialsStore.getByTicker('RAT')!;
const mode = useTileState('mode');

function createModeModel(value: MatioMode) {
  return computed({
    get: () => mode.value === value,
    set: x => {
      if (x) {
        mode.value = value;
      }
    },
  });
}

const all = createModeModel('all');
const production = createModeModel('production');
const workforce = createModeModel('workforce');

const expand = useTileState('expand');

const anyExpanded = computed(() => expand.value.length > 0);

function onExpandAllClick() {
  if (expand.value.length > 0) {
    expand.value = [];
  } else {
    expand.value = planetBurn.value?.map(x => x.naturalId) ?? [];
  }
}

function formatBurnTable(burns: PlanetBurn[]) {
  const lines = ['Planet\tTicker\tInv\tIn\tOut\tΔ'];
  for (const planet of burns) {
    const sorted = getSortedTickers(planet);
    for (const material of sorted) {
      const mat = planet.burn[material.ticker];
      if (!matchesMode(mat, mode.value)) {
        continue;
      }
      const inAmount = Math.round((mat.input + mat.workforce) * 1000) / 1000;
      const outAmount = Math.round(mat.output * 1000) / 1000;
      const netAmount = Math.round(mat.dailyAmount * 1000) / 1000;
      lines.push(
        `${planet.planetName}\t${material.ticker}\t${mat.inventory}\t${inAmount}\t${outAmount}\t${netAmount}`,
      );
    }
  }
  return lines.join('\n');
}

function copyBurnTable() {
  if (!planetBurn.value) {
    return '';
  }
  return formatBurnTable(planetBurn.value);
}
</script>

<template>
  <LoadingSpinner v-if="planetBurn === undefined" />
  <template v-else>
    <div :class="C.ComExOrdersPanel.filter">
      <RadioItem v-model="all" horizontal>All</RadioItem>
      <RadioItem v-model="production" horizontal>Production</RadioItem>
      <RadioItem v-model="workforce" horizontal>Workforce</RadioItem>
      <div :class="$style.spacer" />
      <CopyButton :copy-fn="copyBurnTable" data-tooltip-position="bottom" />
    </div>
    <table>
      <thead>
        <tr>
          <th v-if="planetBurn.length > 1" :class="$style.expand" @click="onExpandAllClick">
            {{ anyExpanded ? '-' : '+' }}
          </th>
          <th v-else />
          <th>Inv</th>
          <th>
            <InlineFlex>
              In
              <Tooltip
                position="bottom"
                tooltip="Daily quantity needed for production / workforce." />
            </InlineFlex>
          </th>
          <th>
            <InlineFlex>
              Out
              <Tooltip position="bottom" tooltip="Daily quantity produced." />
            </InlineFlex>
          </th>
          <th>
            <InlineFlex>
              Δ
              <Tooltip position="bottom" tooltip="Daily net production / consumption." />
            </InlineFlex>
          </th>
          <th>CMD</th>
        </tr>
      </thead>
      <tbody :class="$style.fakeRow">
        <MaterialRow always-visible :burn="fakeBurn" :material="rat" />
      </tbody>
      <BurnSection
        v-for="burn in planetBurn"
        :key="burn.planetName"
        :can-minimize="planetBurn.length > 1"
        :burn="burn" />
    </table>
  </template>
</template>

<style module>
.fakeRow {
  visibility: collapse;
}

.spacer {
  flex: 1;
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
