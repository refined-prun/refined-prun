<script setup lang="ts">
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import PrunButton from '@src/components/PrunButton.vue';
import RadioItem from '@src/components/forms/RadioItem.vue';
import PlanetRow from '@src/features/XIT/DSP/PlanetRow.vue';
import ShipPool from '@src/features/XIT/DSP/ShipPool.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { comparePlanets } from '@src/util';
import { useTileState } from '@src/store/user-data-tiles';
import { getPlanetBurn, getResupplyDays } from '@src/core/burn';
import { getRepairOffset, getRepairThreshold } from '@src/core/buildings';
import { countDays } from '@src/features/XIT/BURN/utils';
import { serializeStorage } from '@src/features/XIT/ACT/actions/utils';
import { allExchangesValue } from '@src/features/XIT/ACT/actions/refuel/utils';
import { setBufferSize, showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { stagedDispatch } from '@src/features/XIT/DSP/staged';
import { vDraggable } from 'vue-draggable-plus';
import { grip } from '@src/components/grip';
import GripHeaderCell from '@src/components/grip/GripHeaderCell.vue';
import { useTile } from '@src/hooks/use-tile';
import {
  DispatchBaseConfig,
  DispatchShip,
  combinedBaseBill,
  fitDaysForShip,
  getShipsAtCX,
  regroupByShip,
} from '@src/features/XIT/DSP/utils';
import { buildDispatchPackage, getDispatchError, DispatchBase } from './package';
import { billTotals, MaterialBill } from '@src/features/XIT/ACT/material-bill';

interface BaseEntry {
  siteId: string;
  naturalId: string;
  planetName: string;
  site: PrunApi.Site;
}

const exchangeFilterOptions: { label: string; code: string }[] = [
  { label: 'ANT', code: 'AI1' },
  { label: 'HRT', code: 'IC1' },
  { label: 'MOR', code: 'NC1' },
  { label: 'BEN', code: 'CI1' },
];

const tile = useTile();
const panesEl = ref<HTMLElement | null>(null);
const baseConfigs = useTileState<Record<string, DispatchBaseConfig>>('baseConfigs', {});
const baseOrder = useTileState<string[]>('baseOrder', []);
const orderedIds = ref<string[]>([]);
const exchangeFilter = useTileState<string | undefined>('exchangeFilter', undefined);
const refuel = useTileState<boolean>('refuel', true);

function createBaseConfig(naturalId: string): DispatchBaseConfig {
  return {
    resupply: true,
    repair: false,
    days: getResupplyDays(naturalId) ?? 10,
    repThreshold: getRepairThreshold(naturalId) - getRepairOffset(naturalId),
    repAdvance: 1,
    materialFilter: 'All',
    cxBuy: true,
    offloadJson: false,
    agent: false,
  };
}

function burnDaysRemaining(siteId: string) {
  const burn = getPlanetBurn(siteId);
  return burn ? countDays(burn.burn) : Infinity;
}

const bases = computed<BaseEntry[] | undefined>(() => {
  const sites = sitesStore.all.value;
  if (!sites) {
    return undefined;
  }

  return sites
    .map(site => ({
      siteId: site.siteId,
      naturalId: getEntityNaturalIdFromAddress(site.address) ?? '',
      planetName: getEntityNameFromAddress(site.address) ?? '',
      site,
    }))
    .filter(x => x.naturalId);
});

// Initialize and migrate base configs outside computed values and rendering.
watchEffect(() => {
  const list = bases.value;
  if (!list) {
    return;
  }
  let next = baseConfigs.value;
  let changed = false;
  for (const base of list) {
    const existing = next[base.naturalId];
    if (existing === undefined) {
      if (!changed) {
        next = { ...next };
        changed = true;
      }
      next[base.naturalId] = createBaseConfig(base.naturalId);
      continue;
    }
    let patched = existing;
    if (
      existing.materialFilter === undefined ||
      existing.cxBuy === undefined ||
      existing.offloadJson === undefined ||
      existing.agent === undefined
    ) {
      patched = {
        ...patched,
        materialFilter: existing.materialFilter ?? 'All',
        cxBuy: existing.cxBuy ?? true,
        offloadJson: existing.offloadJson ?? false,
        agent: existing.agent ?? false,
      };
    }
    if (patched !== existing) {
      if (!changed) {
        next = { ...next };
        changed = true;
      }
      next[base.naturalId] = patched;
    }
  }
  if (changed) {
    baseConfigs.value = next;
  }
});

// Bases paired with their configs; configs are filled by the watcher above.
const rows = computed(() =>
  (bases.value ?? [])
    .map(base => ({ base, config: baseConfigs.value[base.naturalId] }))
    .filter(x => x.config !== undefined),
);

// Size to content after the first data render using setBufferSize.
// The game's asynchronous initial size would overwrite a direct style.width change.
const stopWidthWatch = watch([() => rows.value.length, panesEl], async ([length, panes]) => {
  if (length === 0 || !panes) {
    return;
  }
  stopWidthWatch();
  await nextTick();
  const windowEl = tile.frame.closest(`.${C.Window.window}`);
  const bodyEl = windowEl ? (_$(windowEl, C.Window.body) as HTMLElement | null) : null;
  if (!bodyEl) {
    return;
  }
  let contentWidth = 0;
  for (const child of Array.from(panes.children)) {
    contentWidth += (child as HTMLElement).offsetWidth;
  }
  if (panes.scrollWidth > panes.clientWidth) {
    contentWidth = panes.scrollWidth;
  }
  const chrome = bodyEl.offsetWidth - panes.clientWidth;
  const width = Math.min(contentWidth + chrome, window.innerWidth - 60);
  const parsedHeight = parseInt(bodyEl.style.height, 10);
  const height = isNaN(parsedHeight) ? 500 : parsedHeight;
  setBufferSize(tile.id, width, height);
});

const rowById = computed(() => {
  const map = new Map<string, { id: string; base: BaseEntry; config: DispatchBaseConfig }>();
  for (const row of rows.value) {
    map.set(row.base.naturalId, { id: row.base.naturalId, base: row.base, config: row.config });
  }
  return map;
});

const orderedRows = computed(() =>
  orderedIds.value.map(x => rowById.value.get(x)).filter(x => !!x),
);

// Per-base resupply+repair bill, computed once and shared by the row display,
// the overload check, and execute().
const billByBase = computed(() => {
  const map = new Map<string, MaterialBill>();
  for (const { base, config } of rows.value) {
    if (!config.resupply && !config.repair) {
      continue;
    }
    const bill = combinedBaseBill(base.naturalId, config, base.site);
    if (bill) {
      map.set(base.naturalId, bill);
    }
  }
  return map;
});

// Keep orderedIds in sync with bases + baseOrder without clobbering an
// in-progress drag reorder.
watchEffect(() => {
  const list = rows.value;
  const present = new Map(list.map(x => [x.base.naturalId, x.base]));
  const ordered: string[] = [];
  for (const id of baseOrder.value) {
    if (present.has(id)) {
      ordered.push(id);
    }
  }
  const orderedSet = new Set(ordered);
  const remaining = list
    .filter(x => !orderedSet.has(x.base.naturalId))
    .map(x => x.base)
    .sort((a, b) => {
      const daysA = burnDaysRemaining(a.siteId);
      const daysB = burnDaysRemaining(b.siteId);
      if (daysA !== daysB) {
        return daysA - daysB;
      }
      return comparePlanets(a.naturalId, b.naturalId);
    })
    .map(x => x.naturalId);
  const next = [...ordered, ...remaining];
  if (next.length !== orderedIds.value.length || next.some((id, i) => id !== orderedIds.value[i])) {
    orderedIds.value = next;
  }
});

// Track ship assignments separately so unrelated config edits do not regroup rows.
const shipAssignments = computed(() => {
  const map = new Map<string, string>();
  for (const row of rows.value) {
    if (row.config?.ship) {
      map.set(row.base.naturalId, row.config.ship);
    }
  }
  return map;
});

// Group newly assigned bases with the ship's existing rows.
watch(shipAssignments, map => {
  const next = regroupByShip(orderedIds.value, map);
  if (next.some((id, i) => id !== orderedIds.value[i])) {
    orderedIds.value = next;
    baseOrder.value = next;
  }
});

const dragOptions = {
  ...grip.draggable,
  onEnd: (evt: unknown) => {
    grip.draggable.onEnd?.(evt as never);
    baseOrder.value = [...orderedIds.value];
  },
};

// Pass the ref from script; template unwrapping would leave the drag directive
// with a stale array when the watcher replaces orderedIds.value.
const dragBinding = [orderedIds, dragOptions];

const cxShips = computed(() => getShipsAtCX() ?? []);

// Filter display only; assignments and execution use the full ship list.
const filteredCxShips = computed(() =>
  exchangeFilter.value
    ? cxShips.value.filter(x => x.exchangeCode === exchangeFilter.value)
    : cxShips.value,
);

const cxShipById = computed(() => {
  const map = new Map<string, DispatchShip>();
  for (const entry of cxShips.value) {
    map.set(entry.ship.id, entry);
  }
  return map;
});

// Ships whose assigned bases' combined bills exceed free cargo capacity.
const overloadedShips = computed(() => {
  const ships = new Map<string, { weight: number; volume: number }>();
  for (const { base, config } of rows.value) {
    if (!config.ship || (!config.resupply && !config.repair)) {
      continue;
    }
    const bill = billByBase.value.get(base.naturalId);
    if (!bill) {
      continue;
    }
    const totals = billTotals(bill);
    const cargo = ships.get(config.ship) ?? { weight: 0, volume: 0 };
    cargo.weight += totals.weight;
    cargo.volume += totals.volume;
    ships.set(config.ship, cargo);
  }
  const result = new Set<string>();
  for (const [shipId, t] of ships) {
    const store = cxShipById.value.get(shipId)?.cargoStore;
    if (!store) {
      continue;
    }
    // Free capacity net of whatever is already in the cargo hold, matching FIT.
    if (
      t.weight > store.weightCapacity - store.weightLoad ||
      t.volume > store.volumeCapacity - store.volumeLoad
    ) {
      result.add(shipId);
    }
  }
  return result;
});

const selectedBases = computed(() => {
  // Keep selected bases in list order, including those whose data is not ready.
  const result: DispatchBase[] = [];
  for (const id of orderedIds.value) {
    const row = rowById.value.get(id);
    if (row === undefined) {
      continue;
    }
    const { base, config } = row;
    if (!config.ship || (!config.resupply && !config.repair)) {
      continue;
    }
    const dispatchShip = cxShipById.value.get(config.ship);
    result.push({
      naturalId: base.naturalId,
      planetName: base.planetName,
      config,
      bill: billByBase.value.get(id),
      ship:
        dispatchShip === undefined
          ? undefined
          : {
              id: dispatchShip.ship.id,
              name: dispatchShip.ship.name ?? dispatchShip.ship.registration,
              exchangeCode: dispatchShip.exchangeCode,
              origin:
                dispatchShip.warehouseStore === undefined
                  ? undefined
                  : serializeStorage(dispatchShip.warehouseStore),
              dest:
                dispatchShip.cargoStore === undefined
                  ? undefined
                  : serializeStorage(dispatchShip.cargoStore),
            },
    });
  }
  return result;
});

const executeTooltip = computed(() => {
  const error = getDispatchError(selectedBases.value);
  if (error !== undefined) {
    return error;
  }
  if (overloadedShips.value.size > 0) {
    return 'A ship is loaded above its capacity';
  }
  return undefined;
});

function fitBase(naturalId: string) {
  const config = baseConfigs.value[naturalId];
  if (!config?.ship) {
    return;
  }
  const dispatchShip = cxShipById.value.get(config.ship);
  if (!dispatchShip?.cargoStore) {
    return;
  }

  const sharingBases = rows.value.map(x => ({
    naturalId: x.base.naturalId,
    config: x.config,
    site: x.base.site,
  }));

  const days = fitDaysForShip(config.ship, sharingBases, dispatchShip.cargoStore);
  if (days === undefined) {
    return;
  }

  for (const base of sharingBases) {
    if (base.config.ship === config.ship && base.config.resupply) {
      base.config.days = days;
    }
  }
}

function execute() {
  if (executeTooltip.value !== undefined) {
    return;
  }

  const refuelAction: UserData.ActionData = {
    type: 'Refuel',
    name: 'Refuel',
    origin: allExchangesValue,
    buyMissingFuel: true,
  };
  const pkg = buildDispatchPackage(selectedBases.value, refuel.value ? refuelAction : undefined);
  if (pkg === undefined) {
    return;
  }

  stagedDispatch.value = {
    // Deep-clone to detach from tile-state reactivity.
    pkg: JSON.parse(JSON.stringify(pkg)),
  };
  showBuffer('XIT DISPATCHACT');
}

function reset() {
  baseConfigs.value = {};
  baseOrder.value = [];
}
</script>

<template>
  <LoadingSpinner v-if="bases === undefined" />
  <div v-else :class="$style.layout">
    <div :class="C.ComExOrdersPanel.filter">
      <RadioItem
        v-for="option in exchangeFilterOptions"
        :key="option.code"
        :model-value="exchangeFilter === option.code"
        horizontal
        @update:model-value="v => (exchangeFilter = v ? option.code : undefined)">
        {{ option.label }}
      </RadioItem>
      <div :class="$style.separator" />
      <RadioItem v-model="refuel" horizontal>REFUEL</RadioItem>
      <div :class="$style.spacer" />
      <PrunButton dark @click="reset">RESET</PrunButton>
      <PrunButton
        primary
        :disabled="executeTooltip !== undefined"
        :data-tooltip="executeTooltip"
        @click="execute">
        EXECUTE
      </PrunButton>
    </div>
    <div ref="panesEl" :class="$style.panes">
      <ShipPool :ships="filteredCxShips" :base-configs="baseConfigs" />
      <div :class="$style.left">
        <table :class="$style.table">
          <thead>
            <tr>
              <th :class="[$style.narrowCol, $style.centered]">Assign</th>
              <GripHeaderCell />
              <th :class="[$style.narrowCol, $style.centered]">Planet</th>
              <th :class="[$style.narrowCol, $style.centered]" colspan="2">Burn</th>
              <th :class="[$style.narrowCol, $style.centered]" colspan="2">Rep</th>
              <th :class="[$style.narrowCol, $style.centered]">Load</th>
              <th :class="[$style.narrowCol, $style.centered]">Materials</th>
              <th :class="[$style.narrowCol, $style.centered]">Fit</th>
              <th :class="[$style.narrowCol, $style.centered]">Days</th>
              <th :class="[$style.narrowCol, $style.centered]">Rep ≥</th>
              <th :class="[$style.narrowCol, $style.centered]">Adv</th>
              <th :class="[$style.narrowCol, $style.centered]">CX</th>
              <th :class="[$style.narrowCol, $style.centered]">Offload</th>
              <th :class="[$style.narrowCol, $style.centered]">Agent</th>
            </tr>
          </thead>
          <tbody v-draggable="dragBinding">
            <PlanetRow
              v-for="row in orderedRows"
              :key="row.id"
              :site-id="row.base.siteId"
              :natural-id="row.base.naturalId"
              :planet-name="row.base.planetName"
              :config="row.config"
              :bill="billByBase.get(row.id)"
              :overloaded="overloadedShips.has(row.config.ship ?? '')"
              @fit="fitBase(row.base.naturalId)" />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style module>
.layout {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
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

.panes {
  display: flex;
  flex-direction: row;
}

.left {
  flex: 0 0 auto;
  min-width: 0;
  overflow: visible;
}

.table {
  border-collapse: collapse;
}

.table thead tr {
  border-bottom: 1px solid #2b485a;
  box-sizing: border-box;
}

.narrowCol {
  width: 0;
  white-space: nowrap;
}

.centered {
  text-align: center;
}
</style>
