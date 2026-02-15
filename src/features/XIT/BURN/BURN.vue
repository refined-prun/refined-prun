<script setup lang="ts">
import RadioItem from '@src/components/forms/RadioItem.vue';
import { getPlanetBurn, MaterialBurn } from '@src/core/burn';
import { comparePlanets } from '@src/util';
import BurnSection from '@src/features/XIT/BURN/BurnSection.vue';
import { useTileState } from '@src/features/XIT/BURN/tile-state';
import Tooltip from '@src/components/Tooltip.vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import MaterialRow from '@src/features/XIT/BURN/MaterialRow.vue';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { countDays } from '@src/features/XIT/BURN/utils';
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

  filtered.sort((a, b) => {
    const daysA = countDays(a.burn);
    const daysB = countDays(b.burn);
    if (daysA !== daysB) {
      return daysA - daysB;
    }
    return comparePlanets(a.naturalId, b.naturalId);
  });

  const overallBurn = {};
  for (const burn of filtered) {
    for (const mat of Object.keys(burn.burn)) {
      if (overallBurn[mat]) {
        overallBurn[mat].dailyAmount += burn.burn[mat].dailyAmount;
        overallBurn[mat].inventory += burn.burn[mat].inventory;
      } else {
        overallBurn[mat] = {};
        overallBurn[mat].dailyAmount = burn.burn[mat].dailyAmount;
        overallBurn[mat].inventory = burn.burn[mat].inventory;
      }
    }
  }

  for (const mat of Object.keys(overallBurn)) {
    if (overallBurn[mat].dailyAmount >= 0) {
      overallBurn[mat].daysLeft = 1000;
    } else {
      overallBurn[mat].daysLeft = -overallBurn[mat].inventory / overallBurn[mat].dailyAmount;
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

const red = useTileState('red');
const yellow = useTileState('yellow');
const green = useTileState('green');
const inf = useTileState('inf');

const fakeBurn: MaterialBurn = {
  dailyAmount: -100000,
  daysLeft: 10,
  inventory: 100000,
  type: 'input',
  input: 100000,
  output: 0,
  workforce: 0,
};

const rat = materialsStore.getByTicker('RAT')!;

const expand = useTileState('expand');

const anyExpanded = computed(() => expand.value.length > 0);

function onExpandAllClick() {
  if (expand.value.length > 0) {
    expand.value = [];
  } else {
    expand.value = planetBurn.value?.map(x => x.naturalId) ?? [];
  }
}
</script>

<template>
  <LoadingSpinner v-if="planetBurn === undefined" />
  <template v-else>
    <div :class="C.ComExOrdersPanel.filter">
      <RadioItem v-model="red" horizontal>RED</RadioItem>
      <RadioItem v-model="yellow" horizontal>YELLOW</RadioItem>
      <RadioItem v-model="green" horizontal>GREEN</RadioItem>
      <RadioItem v-model="inf" horizontal>INF</RadioItem>
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
              Burn
              <Tooltip position="bottom" tooltip="How much of a material is consumed per day." />
            </InlineFlex>
          </th>
          <th>
            <InlineFlex>
              Need
              <Tooltip
                position="bottom"
                tooltip="How much of a material needs to be delivered to be fully supplied." />
            </InlineFlex>
          </th>
          <th>Days</th>
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

.expand {
  text-align: center;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  padding-left: 18px;
  font-weight: bold;
}
</style>
