<script setup lang="ts">
import CopyButton from '@src/components/CopyButton.vue';
import RadioItem from '@src/components/forms/RadioItem.vue';
import { getPlanetBurn, PlanetBurn } from '@src/core/burn';
import { comparePlanets } from '@src/util';
import MatioSection from '@src/features/XIT/MATIO/MatioSection.vue';
import { useTileState } from '@src/features/XIT/MATIO/tile-state';
import Tooltip from '@src/components/Tooltip.vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import MaterialRow from '@src/features/XIT/MATIO/MaterialRow.vue';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import {
  defaultPricing,
  formatFlowAmount,
  getPriceForPricing,
  getSortedTickers,
  matchesMode,
  MatioMaterialFlow,
  MatioMode,
  normalizePricing,
} from '@src/features/XIT/MATIO/utils';
import InlineFlex from '@src/components/InlineFlex.vue';
import { findWithQuery } from '@src/utils/find-with-query';
import { convertToPlanetNaturalId } from '@src/core/planet-natural-id';
import { fixed2, formatCurrency } from '@src/utils/format';

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
  const included = result.excludeAll ? [] : result.includeAll ? allSites : result.include;
  const matches = included.filter(x => !result.exclude.has(x));
  const nonOverallMatches = matches.filter(x => x !== overall);
  const overallIncluded =
    nonOverallMatches.length > 1 ||
    matches.length !== nonOverallMatches.length ||
    result.includeAll;
  const overallExcluded = result.exclude.has(overall) || result.excludeAll;

  const overallOnly = matches.length === 1 && matches[0] === overall && !overallExcluded;

  return {
    sites: overallOnly ? allSites.filter(x => !result.exclude.has(x)) : nonOverallMatches,
    includeOverall: overallOnly || (overallIncluded && !overallExcluded),
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

const sections = computed(() => {
  const query = queryResult.value;
  if (query === undefined) {
    return undefined;
  }

  const filtered = query.sites
    .filter(x => x !== overall)
    .map(getPlanetBurn)
    .filter(x => x !== undefined);
  if (filtered.length <= 1) {
    return filtered;
  }

  filtered.sort((a, b) => comparePlanets(a.naturalId, b.naturalId));

  const overallBurn: PlanetBurn['burn'] = {};
  for (const section of filtered) {
    for (const [ticker, materialBurn] of Object.entries(section.burn)) {
      const existing = overallBurn[ticker];
      if (existing) {
        existing.dailyAmount += materialBurn.dailyAmount;
        existing.inventory += materialBurn.inventory;
        existing.input += materialBurn.input;
        existing.output += materialBurn.output;
        existing.workforce += materialBurn.workforce;
      } else {
        overallBurn[ticker] = {
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
  if (query.overallOnly) {
    return [overallSection];
  }

  if (query.includeOverall) {
    filtered.push(overallSection);
  }
  return filtered;
});

const fakeFlow: MatioMaterialFlow = {
  input: 100000,
  output: 125000,
  dailyAmount: 25000,
  workforce: 0,
};

const rat = materialsStore.getByTicker('RAT')!;
const mode = useTileState('mode');
const pricingByPlanet = useTileState('pricingByPlanet');
const currencySymbol = computed(() => formatCurrency(0, () => '').trim());

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
  expand.value = expand.value.length > 0 ? [] : (sections.value?.map(x => x.naturalId) ?? []);
}

function formatFlowTable(sections: PlanetBurn[]) {
  const lines = [`Planet\tTicker\tIn\tOut\tNet\t${currencySymbol.value}/day`];
  for (const planet of sections) {
    const pricing = normalizePricing(pricingByPlanet.value[planet.naturalId || 'overall']);
    for (const material of getSortedTickers(planet)) {
      const mat = planet.burn[material.ticker];
      if (!matchesMode(mat, mode.value)) {
        continue;
      }
      const inAmount = formatFlowAmount(mat.input + mat.workforce);
      const outAmount = formatFlowAmount(mat.output);
      const netAmount = formatFlowAmount(mat.dailyAmount);
      const price = getPriceForPricing(material.ticker, pricing);
      const valuePerDay = price === undefined ? '--' : fixed2(mat.dailyAmount * price);
      lines.push(
        `${planet.planetName}\t${material.ticker}\t${inAmount}\t${outAmount}\t${netAmount}\t${valuePerDay}`,
      );
    }
  }
  return lines.join('\n');
}

function copyBurnTable() {
  return sections.value ? formatFlowTable(sections.value) : '';
}
</script>

<template>
  <LoadingSpinner v-if="sections === undefined" />
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
          <th v-if="sections.length > 1" :class="$style.expand" @click="onExpandAllClick">
            {{ anyExpanded ? '-' : '+' }}
          </th>
          <th v-else />
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
              Net
              <Tooltip position="bottom" tooltip="Daily net production / consumption." />
            </InlineFlex>
          </th>
          <th>
            <InlineFlex>
              {{ currencySymbol }}/day
              <Tooltip position="bottom" tooltip="Daily revenue / cost." />
            </InlineFlex>
          </th>
          <th>CMD</th>
        </tr>
      </thead>
      <tbody :class="$style.fakeRow">
        <MaterialRow always-visible :flow="fakeFlow" :material="rat" :pricing="defaultPricing" />
      </tbody>
      <MatioSection
        v-for="section in sections"
        :key="section.planetName"
        :can-minimize="sections.length > 1"
        :section="section" />
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
