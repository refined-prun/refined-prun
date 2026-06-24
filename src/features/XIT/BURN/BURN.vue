<script setup lang="ts">
import CopyButton from '@src/components/CopyButton.vue';
import RadioItem from '@src/components/forms/RadioItem.vue';
import { BurnValues, getPlanetBurn, MaterialBurn, PlanetBurn } from '@src/core/burn';
import { comparePlanets } from '@src/util';
import BurnSection from '@src/features/XIT/BURN/BurnSection.vue';
import { useTileState } from '@src/features/XIT/BURN/tile-state';
import Tooltip from '@src/components/Tooltip.vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import MaterialRow from '@src/features/XIT/BURN/MaterialRow.vue';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { countDays, getSortedTickers } from '@src/features/XIT/BURN/utils';
import InlineFlex from '@src/components/InlineFlex.vue';
import { findWithQuery } from '@src/utils/find-with-query';
import { convertToPlanetNaturalId } from '@src/core/planet-natural-id';
import { userData } from '@src/store/user-data';

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

const red = useTileState('red');
const yellow = useTileState('yellow');
const green = useTileState('green');
const inf = useTileState('inf');
const prod = useTileState('prod');
const wf = useTileState('wf');
const io = useTileState('io');

function filterBurn(burn: BurnValues): BurnValues {
  const filtered: BurnValues = {};
  for (const ticker of Object.keys(burn)) {
    const mat = burn[ticker];
    const hasProd = mat.input > 0 || mat.output > 0;
    const hasWf = mat.workforce > 0;
    if (!(hasProd && prod.value) && !(hasWf && wf.value)) {
      continue;
    }
    filtered[ticker] = mat;
  }
  return filtered;
}

const planetBurn = computed(() => {
  if (queryResult.value === undefined) {
    return undefined;
  }

  const filtered = queryResult.value.sites
    .filter(x => x !== overall)
    .map(getPlanetBurn)
    .filter(x => x !== undefined)
    .map(x => ({ ...x, burn: filterBurn(x.burn) }));
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

  const overallBurn: BurnValues = {};
  for (const planet of filtered) {
    for (const ticker of Object.keys(planet.burn)) {
      const mat = planet.burn[ticker];
      overallBurn[ticker] ??= {
        input: 0,
        output: 0,
        workforce: 0,
        dailyAmount: 0,
        remainingAllocation: 0,
        inventory: 0,
        daysLeft: 0,
        type: 'output',
      };
      overallBurn[ticker].input += mat.input;
      overallBurn[ticker].output += mat.output;
      overallBurn[ticker].workforce += mat.workforce;
      overallBurn[ticker].remainingAllocation += mat.remainingAllocation;
      overallBurn[ticker].inventory += mat.inventory;
    }
  }

  for (const ticker of Object.keys(overallBurn)) {
    const mat = overallBurn[ticker];
    mat.dailyAmount = mat.output - mat.input - mat.workforce;
    const remaining = mat.inventory + mat.remainingAllocation;
    mat.daysLeft = mat.dailyAmount >= 0 ? Number.POSITIVE_INFINITY : remaining / -mat.dailyAmount;
  }

  const overallSection = { burn: overallBurn, planetName: 'Overall', naturalId: '', storeId: '' };

  if (queryResult.value.overallOnly) {
    return [overallSection];
  }
  const sections = filtered.slice();
  if (queryResult.value.includeOverall) {
    sections.push(overallSection);
  }
  return sections;
});

const fakeBurn: MaterialBurn = {
  dailyAmount: -100000,
  daysLeft: 10,
  remainingAllocation: 0,
  inventory: 100000,
  type: 'input',
  input: 100000,
  output: 100000,
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

// Exports all materials regardless of active color filters (RED/YELLOW/GREEN/INF)
// so spreadsheet users always get the complete dataset.
function formatBurnTable(burns: PlanetBurn[]) {
  const resupply = userData.settings.burn.resupply;
  const header = io.value
    ? 'Planet\tTicker\tInv\tIn\tOut\tNet\tNeed\tDays'
    : 'Planet\tTicker\tInv\tBurn/day\tNeed\tDays';
  const lines = [header];
  const round = (x: number) => Math.round(x * 1000) / 1000;
  for (const planet of burns) {
    const sorted = getSortedTickers(planet);
    for (const material of sorted) {
      const mat = planet.burn[material.ticker];
      const days = mat.dailyAmount >= 0 ? '' : Math.floor(mat.daysLeft).toString();
      const burn = round(mat.dailyAmount);
      const inv = mat.inventory + mat.inventory;
      const need =
        mat.dailyAmount >= 0 || mat.daysLeft > resupply
          ? 0
          : Math.ceil((mat.daysLeft - resupply) * mat.dailyAmount);
      if (io.value) {
        const inAmt = round(mat.input + mat.workforce);
        const outAmt = round(mat.output);
        lines.push(
          `${planet.planetName}\t${material.ticker}\t${inv}\t${inAmt}\t${outAmt}\t${burn}\t${need}\t${days}`,
        );
      } else {
        lines.push(`${planet.planetName}\t${material.ticker}\t${inv}\t${burn}\t${need}\t${days}`);
      }
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
      <RadioItem v-model="red" horizontal>RED</RadioItem>
      <RadioItem v-model="yellow" horizontal>YELLOW</RadioItem>
      <RadioItem v-model="green" horizontal>GREEN</RadioItem>
      <RadioItem v-model="inf" horizontal>INF</RadioItem>
      <div :class="$style.separator" />
      <RadioItem
        v-model="prod"
        horizontal
        :class="$style.radioItemWithTooltip"
        data-tooltip="Toggle materials with production consumption. When off, hides materials only used in production."
        data-tooltip-position="bottom">
        PROD
      </RadioItem>
      <RadioItem
        v-model="wf"
        horizontal
        :class="$style.radioItemWithTooltip"
        data-tooltip="Toggle materials with workforce consumption. When off, hides materials only consumed by workforce."
        data-tooltip-position="bottom">
        WF
      </RadioItem>
      <div :class="$style.separator" />
      <RadioItem v-model="io" horizontal>I/O</RadioItem>
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
          <th>
            <InlineFlex>
              Inv
              <Tooltip
                position="right"
                tooltip="How much of a material the inventory still has. Fractional amount
                 represents the leftover materials since the last workforce consumption event." />
            </InlineFlex>
          </th>
          <template v-if="io">
            <th>In</th>
            <th>Out</th>
            <th>Net</th>
          </template>
          <th v-else>
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

.spacer {
  flex: 1;
}

.separator {
  width: 1px;
  align-self: stretch;
  background-color: #2b485a;
  margin: 0 0.25rem;
}

.expand {
  text-align: center;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  padding-left: 18px;
  font-weight: bold;
}

.radioItemWithTooltip {
  padding: 0;
}
</style>
