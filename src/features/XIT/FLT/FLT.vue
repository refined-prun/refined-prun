<script setup lang="ts">
import { computed } from 'vue';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { exchangesStore } from '@src/infrastructure/prun-api/data/exchanges';
import { getDestinationName } from '@src/infrastructure/prun-api/data/addresses';
import { getInvStore } from '@src/core/store-id';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { useTileState } from '@src/store/user-data-tiles';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import RadioItem from '@src/components/forms/RadioItem.vue';
import FleetStatusCell from './FleetStatusCell.vue';
import CargoBar from './CargoBar.vue';
import { fixed0 } from '@src/utils/format';

type SortKey = 'name' | 'cargo' | 'status' | 'fuel';
type SortDirection = 'asc' | 'desc';

const sortKey = useTileState<SortKey>('sortKey', 'name');
const sortDirection = useTileState<SortDirection>('sortDirection', 'asc');
const showFilters = useTileState('showFilters', false);
const showStlShips = useTileState('showStlShips', true);
const showFtlShips = useTileState('showFtlShips', true);
const showInFlightShips = useTileState('showInFlightShips', true);
const showNotInFlightShips = useTileState('showNotInFlightShips', true);
const hideReturningToCx = useTileState('hideReturningToCx', false);
const inventorySizeFilters = useTileState<string[]>('inventorySizeFilters', []);

const cxCodes = computed(() => {
  const exchanges = exchangesStore.all.value ?? [];
  return new Set(exchanges.map(x => x.code.toUpperCase()));
});

const rawRows = computed(() => {
  const ships = shipsStore.all.value;
  if (!ships) {
    return undefined;
  }

  return ships.map(ship => {
    const flight = flightsStore.getById(ship.flightId);
    const inventory = getInvStore(ship.idShipStore);
    const stlStore = storagesStore.getById(ship.idStlFuelStore);
    const ftlStore = storagesStore.getById(ship.idFtlFuelStore);

    const stlCapacity = stlStore?.weightCapacity;
    const ftlCapacity = ftlStore?.weightCapacity;

    const stlFuelRatio =
      stlStore != null && stlCapacity != null && stlCapacity > 0
        ? stlStore.weightLoad / stlCapacity
        : undefined;
    const ftlFuelRatio =
      ftlStore != null && ftlCapacity != null && ftlCapacity > 0
        ? ftlStore.weightLoad / ftlCapacity
        : undefined;

    const condition = ship.condition <= 1 ? ship.condition * 100 : ship.condition;
    const cargoRatio = inventory
      ? Math.max(
          inventory.weightCapacity > 0 ? inventory.weightLoad / inventory.weightCapacity : 0,
          inventory.volumeCapacity > 0 ? inventory.volumeLoad / inventory.volumeCapacity : 0,
        )
      : 0;
    const fuelRatio = Math.max(stlFuelRatio ?? 0, ftlFuelRatio ?? 0);
    const now = Date.now();
    const arrivalTimestamp = flight?.arrival.timestamp;
    const statusSortValue =
      arrivalTimestamp != null && !Number.isNaN(arrivalTimestamp)
        ? Math.max(0, arrivalTimestamp - now)
        : 0;
    const isFtlCapable = (ftlCapacity ?? 0) > 0;
    const inFlight = ship.flightId != null;
    const destinationCode = getDestinationName(flight?.destination)?.toUpperCase();
    const isReturningToCx = destinationCode != null && cxCodes.value.has(destinationCode);

    return {
      ship,
      stlFuelRatio,
      ftlFuelRatio,
      cargoRatio,
      fuelRatio,
      statusSortValue,
      conditionText: `${Math.round(condition)}%`,
      cargoSizeText: getCargoSizeText(inventory),
      isFtlCapable,
      inFlight,
      isReturningToCx,
    };
  });
});

const inventorySizeOptions = computed(() => {
  const source = rawRows.value;
  if (!source) {
    return [];
  }

  const seen = new Set<string>();
  const options: string[] = [];
  for (const row of source) {
    if (!seen.has(row.cargoSizeText)) {
      seen.add(row.cargoSizeText);
      options.push(row.cargoSizeText);
    }
  }
  return options;
});

const filteredRows = computed(() => {
  const source = rawRows.value;
  if (!source) {
    return undefined;
  }

  return source.filter(x => {
    if (!showStlShips.value && !x.isFtlCapable) {
      return false;
    }
    if (!showFtlShips.value && x.isFtlCapable) {
      return false;
    }
    if (!showInFlightShips.value && x.inFlight) {
      return false;
    }
    if (!showNotInFlightShips.value && !x.inFlight) {
      return false;
    }
    if (hideReturningToCx.value && x.isReturningToCx) {
      return false;
    }

    const selectedSizes = inventorySizeFilters.value;
    if (selectedSizes.length > 0 && !selectedSizes.includes(x.cargoSizeText)) {
      return false;
    }

    return true;
  });
});

const rows = computed(() => {
  const source = filteredRows.value;
  if (!source) {
    return undefined;
  }

  const sign = sortDirection.value === 'asc' ? 1 : -1;
  const sorted = [...source];

  sorted.sort((a, b) => {
    const nameCompare = (a.ship.name || a.ship.registration).localeCompare(
      b.ship.name || b.ship.registration,
    );

    switch (sortKey.value) {
      case 'name': {
        return sign * nameCompare;
      }
      case 'cargo': {
        const primary = a.cargoRatio - b.cargoRatio;
        return primary !== 0 ? sign * primary : nameCompare;
      }
      case 'status': {
        const primary = a.statusSortValue - b.statusSortValue;
        return primary !== 0 ? sign * primary : nameCompare;
      }
      case 'fuel': {
        const primary = a.fuelRatio - b.fuelRatio;
        return primary !== 0 ? sign * primary : nameCompare;
      }
    }
  });

  return sorted;
});

const activeFilterCount = computed(() => {
  let count = 0;

  if (!showStlShips.value || !showFtlShips.value) {
    count += 1;
  }
  if (!showInFlightShips.value || !showNotInFlightShips.value) {
    count += 1;
  }
  if (inventorySizeFilters.value.length > 0) {
    count += 1;
  }
  if (hideReturningToCx.value) {
    count += 1;
  }

  return count;
});

const filterSymbol = computed(() => (showFilters.value ? '-' : '+'));

function setSort(key: SortKey) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    return;
  }

  sortKey.value = key;
  sortDirection.value = 'asc';
}

function getSortLabel(key: SortKey) {
  if (sortKey.value !== key) {
    return '';
  }
  return sortDirection.value === 'asc' ? ' ▲' : ' ▼';
}

function getCargoSizeText(inventory: PrunApi.Store | undefined) {
  if (!inventory) {
    return '--/--';
  }

  return `${toCompactK(inventory.weightCapacity)}/${toCompactK(inventory.volumeCapacity)}`;
}

function toCompactK(value: number) {
  if (value >= 1000) {
    return `${Math.round(value / 1000)}k`;
  }
  return fixed0(value);
}

function onFuel(registration: string) {
  showBuffer(`SHPF ${registration}`);
}

function toggleFilters() {
  showFilters.value = !showFilters.value;
}

function isInventorySizeSelected(size: string) {
  const selected = inventorySizeFilters.value;
  return selected.length === 0 || selected.includes(size);
}

function onInventorySizeClick(size: string) {
  const options = inventorySizeOptions.value;
  const selected = inventorySizeFilters.value;

  if (selected.length === 0) {
    inventorySizeFilters.value = options.filter(x => x !== size);
    return;
  }

  let next: string[];
  if (selected.includes(size)) {
    next = selected.filter(x => x !== size);
  } else {
    next = [...selected, size];
  }

  if (next.length === 0 || next.length === options.length) {
    inventorySizeFilters.value = [];
    return;
  }

  inventorySizeFilters.value = next;
}

function clearFilters() {
  showStlShips.value = true;
  showFtlShips.value = true;
  showInFlightShips.value = true;
  showNotInFlightShips.value = true;
  hideReturningToCx.value = false;
  inventorySizeFilters.value = [];
}
</script>

<template>
  <LoadingSpinner v-if="!rows" />
  <div v-else :class="$style.content">
    <div :class="[C.FormComponent.containerPassive, C.forms.passive, C.forms.formComponent]">
      <label :class="[C.FormComponent.label, C.fonts.fontRegular, C.type.typeRegular]">
        Minimize
      </label>
      <div :class="[C.FormComponent.input, C.forms.input]">
        <div>
          <div :class="$style.minimize" @click="toggleFilters">{{ filterSymbol }}</div>
        </div>
      </div>
    </div>

    <div v-if="showFilters" :class="$style.filterPanel">
      <div :class="$style.filterMeta">
        <span v-if="activeFilterCount > 0" :class="$style.activeCount">
          {{ activeFilterCount }} active
        </span>
        <span
          v-if="activeFilterCount > 0"
          :class="[C.Link.link, $style.clearFilters]"
          @click="clearFilters">
          reset
        </span>
      </div>

      <div :class="$style.filterGroup">
        <div :class="$style.filterTitle">Ship list</div>
        <div :class="C.ComExOrdersPanel.filter">
          <RadioItem v-model="showStlShips" horizontal>STL</RadioItem>
          <RadioItem v-model="showFtlShips" horizontal>FTL</RadioItem>
        </div>
      </div>

      <div :class="$style.filterGroup">
        <div :class="$style.filterTitle">Flight state</div>
        <div :class="C.ComExOrdersPanel.filter">
          <RadioItem v-model="showInFlightShips" horizontal>IN FLIGHT</RadioItem>
          <RadioItem v-model="showNotInFlightShips" horizontal>DOCKED</RadioItem>
        </div>
      </div>

      <div :class="$style.filterGroup">
        <div :class="$style.filterTitle">Inventory size</div>
        <span
          v-for="size in inventorySizeOptions"
          :key="size"
          :class="[
            $style.inventorySizeChip,
            { [$style.inventorySizeChipActive]: isInventorySizeSelected(size) },
          ]"
          @click="onInventorySizeClick(size)">
          {{ size }}
        </span>
      </div>

      <div :class="$style.filterGroup">
        <div :class="$style.filterTitle">Route</div>
        <div :class="C.ComExOrdersPanel.filter">
          <RadioItem v-model="hideReturningToCx" horizontal>HIDE CX RETURNS</RadioItem>
        </div>
        <div :class="$style.filterHint">ANT, BEN, and other exchange codes.</div>
      </div>
    </div>

    <table :class="$style.table">
      <thead>
        <tr>
          <th :class="[$style.headerCell, $style.sortable]" @click="setSort('name')">
            Name{{ getSortLabel('name') }}
          </th>
          <th :class="[$style.headerCell, $style.sortable]" @click="setSort('cargo')">
            Cargo{{ getSortLabel('cargo') }}
          </th>
          <th :class="[$style.headerCell, $style.sortable]" @click="setSort('status')">
            Status{{ getSortLabel('status') }}
          </th>
          <th :class="[$style.headerCell, $style.sortable]" @click="setSort('fuel')">
            Fuel{{ getSortLabel('fuel') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="x in rows" :key="x.ship.id">
          <td :class="$style.bodyCell">
            <span :class="C.Link.link" @click="showBuffer(`SFC ${x.ship.registration}`)">
              {{ x.ship.name || x.ship.registration }}
            </span>
            <span :class="C.ColoredValue.positive">&nbsp;{{ x.conditionText }}</span>
          </td>

          <td :class="[$style.bodyCell, $style.cargoCell]">
            <CargoBar :ship-id="x.ship.id" />
            <div :class="[C.ShipStore.pointer, C.ShipStore.store, $style.cargoSize]">
              {{ x.cargoSizeText }}
            </div>
          </td>

          <td :class="$style.bodyCell">
            <FleetStatusCell :ship-id="x.ship.id" />
          </td>

          <td :class="[$style.bodyCell, $style.fuelCell]">
            <div
              :class="[C.ShipFuel.container, C.ShipFuel.pointer, $style.fuelBars]"
              @click="onFuel(x.ship.registration)">
              <div :class="C.ProgressBar.container">
                <progress
                  :class="[C.ProgressBar.primary, C.ProgressBar.progress]"
                  :value="x.stlFuelRatio ?? 0"
                  max="1" />
              </div>
              <div :class="C.ProgressBar.container">
                <progress
                  :class="[C.ProgressBar.secondary, C.ProgressBar.progress]"
                  :value="x.ftlFuelRatio ?? 0"
                  max="1" />
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style module>
.content {
  padding-left: 6px;
}

.minimize {
  font-size: 14px;
  font-weight: bold;
  margin-left: auto;
  margin-right: 3px;
  margin-top: 1px;
  text-align: center;
  width: 18px;
  cursor: pointer;
  background-color: #26353e;
  color: #3fa2de;

  &:hover {
    color: #26353e;
    background-color: #3fa2de;
  }
}

.clearFilters {
  user-select: none;
  font-size: 12px;
  opacity: 1;
}

.activeCount {
  display: inline-block;
  border: 1px solid rgb(70, 70, 70);
  border-radius: 3px;
  padding: 1px 6px;
  line-height: 16px;
  color: rgb(174, 184, 195);
}

.filterPanel {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
  margin-top: 4px;
}

.filterMeta {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 20px;
}

.filterGroup {
  border: 1px solid rgb(70, 70, 70);
  border-radius: 3px;
  padding: 4px 6px;
  min-width: 180px;
}

.filterTitle {
  font-size: 11px;
  text-transform: uppercase;
  opacity: 0.8;
  margin-bottom: 4px;
}

.filterHint {
  margin-top: 4px;
  font-size: 11px;
  opacity: 0.7;
}

.inventorySizeChip {
  display: inline-block;
  margin-right: 4px;
  margin-bottom: 4px;
  border: 1px solid rgb(80, 80, 80);
  border-radius: 3px;
  padding: 2px 5px;
  cursor: pointer;
  user-select: none;
}

.inventorySizeChipActive {
  border-color: rgb(138, 164, 98);
  color: rgb(171, 198, 128);
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.headerCell {
  text-align: left;
  padding: 4px 6px;
}

.sortable {
  cursor: pointer;
}

.bodyCell {
  padding: 4px 6px;
  vertical-align: middle;
}

.cargoCell {
  min-width: 70px;
  padding: 2px;
  padding-bottom: 0px;
}

.cargoSize {
  margin-top: 2px;
}

.fuelCell {
  min-width: 120px;
}

.fuelBars {
  display: flex;
  flex-flow: row wrap;
  align-items: stretch;
  gap: 2px;
  width: 100%;
}

.fuelBars > div {
  width: 40px;
  flex: 0 0 40px;
}
</style>
