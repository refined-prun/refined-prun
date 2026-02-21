<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { getPlanetBurn, PlanetBurn } from '@src/core/burn';
import { comparePlanets } from '@src/util';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { countDays } from '@src/features/XIT/BURN/utils';
import { findWithQuery } from '@src/utils/find-with-query';
import { convertToPlanetNaturalId } from '@src/core/planet-natural-id';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { sortMaterials } from '@src/core/sort-materials';
import { fixed0, fixed2 } from '@src/utils/format';

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

interface TableRow {
  planet: string;
  ticker: string;
  inv: number;
  burnPerDay: number;
  days: number;
}

function getSortedMaterials(burn: PlanetBurn) {
  const materials = Object.keys(burn.burn).map(materialsStore.getByTicker);
  return sortMaterials(materials.filter(x => x !== undefined));
}

const tableRows = computed(() => {
  if (!planetBurn.value) {
    return undefined;
  }

  const rows: TableRow[] = [];
  for (const planet of planetBurn.value) {
    const sorted = getSortedMaterials(planet);
    for (const material of sorted) {
      const mat = planet.burn[material.ticker];
      const isInf = mat.dailyAmount >= 0;
      const days = isInf ? 1000 : mat.daysLeft;
      rows.push({
        planet: planet.planetName,
        ticker: material.ticker,
        inv: mat.inventory,
        burnPerDay: mat.dailyAmount,
        days,
      });
    }
  }
  return rows;
});

function formatTable(rows: TableRow[]) {
  const lines = ['Planet\tTicker\tInv\tBurn/day\tDays'];
  for (const row of rows) {
    const days = Math.floor(row.days) < 500 ? Math.floor(row.days).toString() : '';
    lines.push(
      `${row.planet}\t${row.ticker}\t${fixed0(row.inv)}\t${fixed2(row.burnPerDay)}\t${days}`,
    );
  }
  return lines.join('\n');
}

function getPlanetRows(planetName: string) {
  return tableRows.value?.filter(r => r.planet === planetName) ?? [];
}

const planets = computed(() => {
  if (!tableRows.value) {
    return [];
  }
  const seen = new Set<string>();
  const result: string[] = [];
  for (const row of tableRows.value) {
    if (!seen.has(row.planet)) {
      seen.add(row.planet);
      result.push(row.planet);
    }
  }
  return result;
});

// Start all collapsed.
const expanded = ref(new Set<string>());

function togglePlanet(planetName: string) {
  if (expanded.value.has(planetName)) {
    expanded.value.delete(planetName);
  } else {
    expanded.value.add(planetName);
  }
}

function toggleAll() {
  if (expanded.value.size > 0) {
    expanded.value.clear();
  } else {
    for (const planet of planets.value) {
      expanded.value.add(planet);
    }
  }
}

async function copyAll() {
  if (!tableRows.value) {
    return;
  }
  await navigator.clipboard.writeText(formatTable(tableRows.value));
}

async function copyPlanet(planetName: string) {
  const rows = getPlanetRows(planetName);
  if (rows.length === 0) {
    return;
  }
  await navigator.clipboard.writeText(formatTable(rows));
}
</script>

<template>
  <LoadingSpinner v-if="tableRows === undefined" />
  <template v-else>
    <div :class="C.ActionBar.container">
      <div :class="C.ActionBar.element">
        <PrunButton primary inline @click="copyAll">COPY ALL</PrunButton>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th :class="$style.expand" @click="toggleAll">
            {{ expanded.size > 0 ? '-' : '+' }}
          </th>
          <th>Ticker</th>
          <th>Inv</th>
          <th>Burn/day</th>
          <th>Days</th>
        </tr>
      </thead>
      <template v-for="planet in planets" :key="planet">
        <tbody>
          <tr :class="$style.planetHeader" @click="togglePlanet(planet)">
            <td :class="$style.expand">{{ expanded.has(planet) ? '-' : '+' }}</td>
            <td colspan="3">{{ planet }}</td>
            <td :class="$style.copyCell">
              <PrunButton dark inline @click.stop="copyPlanet(planet)">COPY</PrunButton>
            </td>
          </tr>
          <template v-if="expanded.has(planet)">
            <tr v-for="row in getPlanetRows(planet)" :key="row.ticker">
              <td />
              <td>{{ row.ticker }}</td>
              <td>{{ fixed0(row.inv) }}</td>
              <td>{{ fixed2(row.burnPerDay) }}</td>
              <td>{{ Math.floor(row.days) < 500 ? Math.floor(row.days) : '' }}</td>
            </tr>
          </template>
        </tbody>
      </template>
    </table>
  </template>
</template>

<style module>
.planetHeader {
  font-weight: bold;
  cursor: pointer;
  user-select: none;
}

.expand {
  text-align: center;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  padding-left: 18px;
  font-weight: bold;
}

.copyCell {
  text-align: right;
}
</style>
