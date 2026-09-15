<script setup lang="ts">
import PrunLink from '@src/components/PrunLink.vue';
import { popiBuildings } from '@src/core/popi-buildings';
import GovBurnDaysCell from '@src/features/XIT/GOVBURN/GovBurnDaysCell.vue';
import { buildingDays, cogcDays } from '@src/features/XIT/GOVBURN/utils';
import { useTile } from '@src/hooks/use-tile';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { openCompanionBuffer } from '@src/infrastructure/prun-ui/companion-buffer';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { userData } from '@src/store/user-data';
import { timestampEachMinute } from '@src/utils/dayjs';

const parameters = useXitParameters();
const tile = useTile();

const parameter = computed(() => parameters.join(' '));

const naturalId = computed(() => {
  const planet = planetsStore.find(parameter.value);
  return planet?.naturalId ?? parameter.value;
});

const displayName = computed(() => {
  const captured = userData.govburn.planets[naturalId.value];
  return captured?.name ?? planetsStore.find(naturalId.value)?.name ?? naturalId.value;
});

const captured = computed(() => userData.govburn.planets[naturalId.value]);

const popiOrder = new Map(popiBuildings.map((x, i) => [x.ticker, i]));

interface BuildingRow {
  ticker: string;
  level: number;
  required: number;
  days: number;
  hasData: boolean;
  order: number;
  isCogc: boolean;
}

const rows = computed(() => {
  const planet = captured.value;
  if (planet === undefined) {
    return [];
  }
  const now = timestampEachMinute.value;
  const config = userData.govburn.config.planets[naturalId.value] ?? {};
  const savedSlots = userData.govburn.config.slots[naturalId.value];
  const result: BuildingRow[] = [];
  for (const building of planet.buildings) {
    if (building.level <= 0) {
      continue;
    }
    const required = config[building.ticker] ?? -1;
    const hasData = building.upkeeps !== undefined;
    const days = buildingDays(building, required, now, savedSlots?.[building.ticker]);
    result.push({
      ticker: building.ticker,
      level: building.level,
      required,
      days,
      hasData,
      order: popiOrder.get(building.ticker) ?? 999,
      isCogc: false,
    });
  }
  if (planet.cogc !== undefined) {
    result.push({
      ticker: 'COGC',
      level: 0,
      required: -1,
      days: cogcDays(planet.cogc, now),
      hasData: true,
      order: 999,
      isCogc: true,
    });
  }
  result.sort((a, b) => {
    if (a.hasData !== b.hasData) {
      return a.hasData ? -1 : 1;
    }
    if (a.hasData && a.days !== b.days) {
      return a.days - b.days;
    }
    return a.order - b.order;
  });
  return result;
});

function onRowClick(e: MouseEvent, row: BuildingRow) {
  const command = row.isCogc
    ? `COGCU ${naturalId.value}`
    : `POPID P-${naturalId.value} T-${row.ticker}`;
  if (e.shiftKey) {
    e.stopPropagation();
    e.preventDefault();
    void openCompanionBuffer(tile, command);
    return;
  }
  showBuffer(command);
}
</script>

<template>
  <template v-if="!captured">
    <p>
      No data for {{ displayName }}. Run
      <PrunLink inline :command="`XIT GOVBURNDATA ${naturalId}`">
        XIT GOVBURNDATA {{ naturalId }}
      </PrunLink>
      .
    </p>
  </template>
  <table v-else>
    <thead>
      <tr>
        <th>Building</th>
        <th>Required</th>
        <th>Days</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.ticker">
        <td :class="$style.building" @click="onRowClick($event, row)">
          <template v-if="row.isCogc">COGC</template>
          <template v-else>{{ row.ticker }} Lvl {{ row.level }}</template>
        </td>
        <td>{{ row.required === -1 ? '--' : row.required }}</td>
        <td v-if="row.required > 0 && !row.hasData">
          <span data-tooltip="No data captured. Run XIT GOVBURNDATA.">--</span>
        </td>
        <GovBurnDaysCell v-else :days="row.days" />
      </tr>
    </tbody>
  </table>
</template>

<style module>
.building {
  cursor: pointer;
}
</style>
