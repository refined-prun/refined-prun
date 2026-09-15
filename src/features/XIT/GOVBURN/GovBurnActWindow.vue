<script setup lang="ts">
import ActionBar from '@src/components/ActionBar.vue';
import Active from '@src/components/forms/Active.vue';
import Header from '@src/components/Header.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import PrunButton from '@src/components/PrunButton.vue';
import PrunLink from '@src/components/PrunLink.vue';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';
import { popiBuildings } from '@src/core/popi-buildings';
import { stagedGovBurn } from '@src/features/XIT/GOVBURN/staged';
import {
  cogcRefills,
  planetGovBurnBill,
  resolveSlots,
  type SlotPick,
} from '@src/features/XIT/GOVBURN/utils';
import { useMinBufferHeight } from '@src/hooks/use-min-buffer-height';
import { useTile } from '@src/hooks/use-tile';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { UI_TILES_CHANGE_COMMAND } from '@src/infrastructure/prun-api/client-messages';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { dispatchClientPrunMessage } from '@src/infrastructure/prun-api/prun-api-listener';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { userData } from '@src/store/user-data';
import { timestampEachMinute } from '@src/utils/dayjs';
import { fixed0, fixed02 } from '@src/utils/format';
import { billTotals, materialBillFromQuantities } from '@src/features/XIT/ACT/material-bill';

const parameters = useXitParameters();
const tile = useTile();
useMinBufferHeight();

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

const planetConfig = computed(() => userData.govburn.config.planets[naturalId.value] ?? {});

const canPlanResupply = computed(() => {
  const planet = captured.value;
  if (planet === undefined) {
    return false;
  }
  const config = planetConfig.value;
  const hasConfiguredBuildings = planet.buildings.some(
    x => x.level > 0 && (config[x.ticker] ?? 0) > 0,
  );
  return hasConfiguredBuildings || planet.cogc !== undefined;
});

const popiOrder = new Map(popiBuildings.map((x, i) => [x.ticker, i]));
const UNKNOWN_TICKER_ORDER = 999;

interface BuildingRow {
  ticker: string;
  level: number;
  n: number;
  hasUpkeeps: boolean;
}

const buildingRows = computed(() => {
  const planet = captured.value;
  if (planet === undefined) {
    return [] as BuildingRow[];
  }
  const config = planetConfig.value;
  const result: BuildingRow[] = [];
  for (const building of planet.buildings) {
    if (building.level <= 0) {
      continue;
    }
    const n = config[building.ticker] ?? 0;
    if (n <= 0) {
      continue;
    }
    result.push({
      ticker: building.ticker,
      level: building.level,
      n,
      hasUpkeeps: (building.upkeeps?.length ?? 0) > 0,
    });
  }
  result.sort(
    (a, b) =>
      (popiOrder.get(a.ticker) ?? UNKNOWN_TICKER_ORDER) -
      (popiOrder.get(b.ticker) ?? UNKNOWN_TICKER_ORDER),
  );
  return result;
});

// Derive slots from saved choices so data updates preserve user selections.
const slots = computed(() => {
  const next: Record<string, SlotPick[]> = {};
  const planet = captured.value;
  if (planet === undefined) {
    return next;
  }
  const config = planetConfig.value;
  const savedSlots = userData.govburn.config.slots[naturalId.value];
  for (const building of planet.buildings) {
    if (building.level <= 0) {
      continue;
    }
    const n = config[building.ticker] ?? 0;
    if (n <= 0 || building.upkeeps === undefined) {
      continue;
    }
    next[building.ticker] = resolveSlots(building, n, savedSlots?.[building.ticker]);
  }
  return next;
});

const dayOptions = ['5', '10', '15', '20', '25', '30'];

const resupplyDays = computed({
  get() {
    const days = userData.govburn.config.resupplyDays;
    if (typeof days === 'number' && dayOptions.includes(String(days))) {
      return String(days);
    }
    return '30';
  },
  set(value: string) {
    const days = Number(value);
    userData.govburn.config.resupplyDays = Number.isFinite(days) && days > 0 ? days : 30;
  },
});

const horizonDays = computed(() => Number(resupplyDays.value));

function slotOptions(buildingTicker: string, slotIndex: number) {
  const building = captured.value?.buildings.find(x => x.ticker === buildingTicker);
  const upkeeps = building?.upkeeps ?? [];
  const buildingSlots = slots.value[buildingTicker] ?? [];
  const usedByOthers = new Set(
    buildingSlots
      .filter((_, i) => i !== slotIndex)
      .map(x => x.ticker)
      .filter(x => x !== ''),
  );
  const available = upkeeps.map(x => x.ticker).filter(x => !usedByOthers.has(x));
  return ['', ...available];
}

function setSlot(buildingTicker: string, slotIndex: number, value: string | undefined) {
  const list = slots.value[buildingTicker];
  if (list === undefined) {
    return;
  }
  const tickers = list.map(x => x.ticker);
  tickers[slotIndex] = value ?? '';
  const naturalIdValue = naturalId.value;
  const stored = (userData.govburn.config.slots[naturalIdValue] ??= {});
  stored[buildingTicker] = tickers;
}

const hasMissingData = computed(() => buildingRows.value.some(x => !x.hasUpkeeps));

const allResolved = computed(() => {
  if (hasMissingData.value) {
    return false;
  }
  for (const list of Object.values(slots.value)) {
    if (list.some(x => x.ticker === '')) {
      return false;
    }
  }
  return true;
});

const bill = computed(() => {
  const planet = captured.value;
  if (planet === undefined || !allResolved.value) {
    return {};
  }
  return planetGovBurnBill(planet, slots.value, horizonDays.value, timestampEachMinute.value);
});

const billNotEmpty = computed(() => Object.keys(bill.value).length > 0);

const billLine = computed(() => {
  const parts = Object.entries(bill.value)
    .map(([ticker, amount]) => `${ticker} ${fixed0(amount)}`)
    .join(', ');
  const totals = billTotals(materialBillFromQuantities(bill.value));
  return `Bill: ${parts} (${fixed02(totals.weight)}t, ${fixed02(totals.volume)}m³)`;
});

const pkg = computed<UserData.ActionPackageData>(() => ({
  global: { name: `GovBurn Resupply ${naturalId.value}` },
  groups: [
    {
      type: 'Manual',
      name: 'GovBurn',
      planet: naturalId.value,
      materials: bill.value,
    },
  ],
  actions: [
    {
      type: 'CX Buy',
      name: 'CX Buy',
      group: 'GovBurn',
      exchange: configurableValue,
      useCXInv: true,
      skippable: true,
    },
    {
      type: 'MTRA',
      name: 'MTRA',
      group: 'GovBurn',
      origin: configurableValue,
      dest: configurableValue,
      sfcDestination: naturalId.value,
    },
  ],
}));

function onExecuteClick() {
  stagedGovBurn.value = { pkg: pkg.value };
  // Reuse the planner tile; clear its command first to force a remount.
  if (!dispatchClientPrunMessage(UI_TILES_CHANGE_COMMAND(tile.id, null))) {
    showBuffer('XIT GOVBURNEXEC');
    return;
  }
  dispatchClientPrunMessage(UI_TILES_CHANGE_COMMAND(tile.id, 'XIT GOVBURNEXEC'));
}
</script>

<template>
  <div :class="$style.root">
    <Header :class="$style.header">GovBurn Resupply {{ displayName }}</Header>
    <template v-if="!captured">
      <p>
        No data for {{ displayName }}. Run
        <PrunLink inline :command="`XIT GOVBURNDATA ${naturalId}`">
          XIT GOVBURNDATA {{ naturalId }}
        </PrunLink>
        .
      </p>
    </template>
    <template v-else-if="!canPlanResupply">
      <p>
        No buildings configured for {{ displayName }}. Configure them in
        <PrunLink inline command="XIT GOVBURN">XIT GOVBURN</PrunLink>
        .
      </p>
    </template>
    <template v-else>
      <div :class="$style.pane">
        <Active label="Days">
          <SelectInput v-model="resupplyDays" :options="dayOptions" />
        </Active>

        <table v-if="buildingRows.length > 0">
          <thead>
            <tr>
              <th>Building</th>
              <th v-for="i in Math.max(0, ...buildingRows.map(x => x.n))" :key="i">Slot {{ i }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in buildingRows" :key="row.ticker">
              <td>{{ row.ticker }} {{ row.level }}</td>
              <template v-if="!row.hasUpkeeps">
                <td :colspan="row.n" :class="$style.noData">no data</td>
              </template>
              <template v-else>
                <td
                  v-for="(slot, index) in slots[row.ticker]"
                  :key="index"
                  :class="{ [$style.unresolved]: slot.ticker === '' }">
                  <div :class="[C.forms.input, $style.selectWrap]">
                    <SelectInput
                      :model-value="slot.ticker"
                      :options="slotOptions(row.ticker, index)"
                      @update:model-value="v => setSlot(row.ticker, index, v)" />
                  </div>
                </td>
              </template>
            </tr>
          </tbody>
        </table>

        <p v-if="captured?.cogc !== undefined" :class="$style.cogcSummary">
          COGC: {{ cogcRefills(horizonDays) }} refill(s) included
        </p>
      </div>
      <p v-if="allResolved && !billNotEmpty" :class="$style.summary">
        Reserves already cover {{ horizonDays }} days - nothing to buy.
      </p>
      <template v-else>
        <p v-if="hasMissingData" :class="$style.summary">
          Missing upkeep data. Run
          <PrunLink inline :command="`XIT GOVBURNDATA ${naturalId}`">
            XIT GOVBURNDATA {{ naturalId }}
          </PrunLink>
          .
        </p>
        <p v-else-if="allResolved" :class="$style.summary">{{ billLine }}</p>
        <p v-else :class="$style.summary">Resolve all upkeep slots to continue.</p>
      </template>
      <ActionBar :class="$style.actionBar">
        <PrunButton v-if="allResolved && billNotEmpty" primary @click="onExecuteClick">
          EXECUTE
        </PrunButton>
      </ActionBar>
    </template>
  </div>
</template>

<style module>
.root {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  margin-left: 4px;
}

.pane {
  flex-grow: 1;
  margin-top: 5px;
  margin-left: 4px;
  padding: 4px;
  background-color: #23282b;
  border: 1px solid #2b485a;
}

.noData {
  color: rgb(217, 83, 79);
  font-style: italic;
}

.unresolved {
  color: rgb(217, 83, 79);
}

.selectWrap {
  width: 4.5rem;
  display: inline-block;
  vertical-align: middle;
}

.selectWrap :global(div) {
  width: 100%;
  margin-left: 0;
}

.summary {
  margin: 0.5rem 0 0.5rem 5px;
}

.cogcSummary {
  margin: 0.5rem 0 0;
  padding-left: 8px;
}

.actionBar {
  margin-left: 2px;
  justify-content: flex-start;
  user-select: none;
}
</style>
