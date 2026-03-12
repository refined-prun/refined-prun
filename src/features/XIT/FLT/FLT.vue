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

const primarySortKey = useTileState<SortKey>('primarySortKey', 'name');
const secondarySortKey = useTileState<SortKey>('secondarySortKey', 'status');
const sortDirectionByKey = useTileState<Record<SortKey, SortDirection>>('sortDirectionByKey', {
  name: 'asc',
  cargo: 'asc',
  status: 'asc',
  fuel: 'asc',
});
const showFilters = useTileState('showFilters', false);
const showStlShips = useTileState('showStlShips', true);
const showFtlShips = useTileState('showFtlShips', true);
const showInFlightShips = useTileState('showInFlightShips', true);
const showNotInFlightShips = useTileState('showNotInFlightShips', true);
const hideReturningToCx = useTileState('hideReturningToCx', false);
const inventorySizeFilters = useTileState<string[]>('inventorySizeFilters', []);
const shipClassFilters = useTileState<string[]>('shipClassFilters', []);
const conditionFilters = useTileState<string[]>('conditionFilters', []);
const cargoStateFilters = useTileState<string[]>('cargoStateFilters', []);
const etaFilters = useTileState<string[]>('etaFilters', []);
const fuelAlertFilter = useTileState<'any' | '75' | '50' | '35' | '25' | '10'>(
  'fuelAlertFilter',
  'any',
);

const conditionOptions = ['100-90', '90-80', '80-0'];
const etaOptions = ['DOCKED', '<1H', '1-6H', '6-12H', '12-24H', '>24H'];
const cargoStateOptions = ['EMPTY', 'PARTIAL', 'FULL'];

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
    const warningFuelRatio = isFtlCapable
      ? Math.min(stlFuelRatio ?? 0, ftlFuelRatio ?? 0)
      : (stlFuelRatio ?? 0);
    const inFlight = ship.flightId != null;
    const destinationCode = getDestinationName(flight?.destination)?.toUpperCase();
    const isReturningToCx = destinationCode != null && cxCodes.value.has(destinationCode);
    const shipClass = getShipClass(ship);
    const conditionBand = getConditionBand(condition);
    const etaBucket = getEtaBucket(inFlight, statusSortValue);
    const cargoState = getCargoState(cargoRatio);

    return {
      ship,
      stlFuelRatio,
      ftlFuelRatio,
      cargoRatio,
      fuelRatio,
      warningFuelRatio,
      statusSortValue,
      conditionText: `${Math.round(condition)}%`,
      cargoSizeText: getCargoSizeText(inventory),
      isFtlCapable,
      inFlight,
      isReturningToCx,
      shipClass,
      conditionBand,
      etaBucket,
      cargoState,
    };
  });
});

const shipClassOptions = computed(() => {
  const source = rawRows.value;
  if (!source) {
    return [];
  }

  const seen = new Set<string>();
  const options: string[] = [];
  for (const row of source) {
    if (!seen.has(row.shipClass)) {
      seen.add(row.shipClass);
      options.push(row.shipClass);
    }
  }
  return options;
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

    if (!isOptionSelected(shipClassFilters.value, x.shipClass)) {
      return false;
    }
    if (!isOptionSelected(conditionFilters.value, x.conditionBand)) {
      return false;
    }
    if (!isOptionSelected(cargoStateFilters.value, x.cargoState)) {
      return false;
    }
    if (!isOptionSelected(etaFilters.value, x.etaBucket)) {
      return false;
    }

    const thresholdMap = {
      any: 1,
      '75': 0.75,
      '50': 0.5,
      '35': 0.35,
      '25': 0.25,
      '10': 0.1,
    };
    const threshold = thresholdMap[fuelAlertFilter.value];
    if (threshold < 1 && x.warningFuelRatio > threshold) {
      return false;
    }

    const selectedSizes = inventorySizeFilters.value;
    if (!isOptionSelected(selectedSizes, x.cargoSizeText)) {
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

  const sorted = [...source];

  const primaryKey = primarySortKey.value;
  let secondaryKey = secondarySortKey.value;
  if (secondaryKey === primaryKey) {
    secondaryKey = 'name';
  }

  const primaryDirection = getSortDirection(primaryKey) === 'asc' ? 1 : -1;
  const secondaryDirection = getSortDirection(secondaryKey) === 'asc' ? 1 : -1;

  sorted.sort((a, b) => {
    const primary = compareByKey(a, b, primaryKey) * primaryDirection;
    if (primary !== 0) {
      return primary;
    }

    const secondary = compareByKey(a, b, secondaryKey) * secondaryDirection;
    if (secondary !== 0) {
      return secondary;
    }

    return compareByKey(a, b, 'name');
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
  if (shipClassFilters.value.length > 0) {
    count += 1;
  }
  if (conditionFilters.value.length > 0) {
    count += 1;
  }
  if (cargoStateFilters.value.length > 0) {
    count += 1;
  }
  if (etaFilters.value.length > 0) {
    count += 1;
  }
  if (fuelAlertFilter.value !== 'any') {
    count += 1;
  }

  return count;
});

const filterSymbol = computed(() => (showFilters.value ? '-' : '+'));

function setSort(key: SortKey) {
  if (primarySortKey.value === key) {
    const nextDirection = getSortDirection(key) === 'asc' ? 'desc' : 'asc';
    sortDirectionByKey.value = {
      ...sortDirectionByKey.value,
      [key]: nextDirection,
    };
    return;
  }

  secondarySortKey.value = primarySortKey.value;
  primarySortKey.value = key;
}

function getSortIndicator(key: SortKey) {
  if (primarySortKey.value === key) {
    return getSortDirection(key) === 'asc' ? '▲' : '▼';
  }
  if (secondarySortKey.value === key && primarySortKey.value !== key) {
    return getSortDirection(key) === 'asc' ? '▲' : '▼';
  }
  return undefined;
}

function isPrimarySort(key: SortKey) {
  return primarySortKey.value === key;
}

function isSecondarySort(key: SortKey) {
  return secondarySortKey.value === key && primarySortKey.value !== key;
}

function getSortDirection(key: SortKey) {
  return sortDirectionByKey.value[key] ?? 'asc';
}

function compareByKey(
  a: {
    ship: PrunApi.Ship;
    cargoRatio: number;
    statusSortValue: number;
    fuelRatio: number;
  },
  b: {
    ship: PrunApi.Ship;
    cargoRatio: number;
    statusSortValue: number;
    fuelRatio: number;
  },
  key: SortKey,
) {
  const nameCompare = (a.ship.name || a.ship.registration).localeCompare(
    b.ship.name || b.ship.registration,
  );

  switch (key) {
    case 'name':
      return nameCompare;
    case 'cargo': {
      const primary = a.cargoRatio - b.cargoRatio;
      return primary !== 0 ? primary : nameCompare;
    }
    case 'status': {
      const primary = a.statusSortValue - b.statusSortValue;
      return primary !== 0 ? primary : nameCompare;
    }
    case 'fuel': {
      const primary = a.fuelRatio - b.fuelRatio;
      return primary !== 0 ? primary : nameCompare;
    }
  }
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

function isOptionSelected(selected: string[], option: string) {
  return selected.length === 0 || selected.includes(option);
}

function toggleOptionFilter(
  target: WritableComputedRef<string[]>,
  options: string[],
  option: string,
) {
  const selected = target.value;

  if (selected.length === 0) {
    target.value = options.filter(x => x !== option);
    return;
  }

  let next: string[];
  if (selected.includes(option)) {
    next = selected.filter(x => x !== option);
  } else {
    next = [...selected, option];
  }

  if (next.length === 0 || next.length === options.length) {
    target.value = [];
    return;
  }

  target.value = next;
}

function onShipClassClick(shipClass: string) {
  toggleOptionFilter(shipClassFilters, shipClassOptions.value, shipClass);
}

function onEtaClick(eta: string) {
  toggleOptionFilter(etaFilters, etaOptions, eta);
}

function onInventorySizeClick(size: string) {
  toggleOptionFilter(inventorySizeFilters, inventorySizeOptions.value, size);
}

function onCargoStateClick(cargoState: string) {
  toggleOptionFilter(cargoStateFilters, cargoStateOptions, cargoState);
}

function onConditionClick(band: string) {
  toggleOptionFilter(conditionFilters, conditionOptions, band);
}

function clearFilters() {
  showStlShips.value = true;
  showFtlShips.value = true;
  showInFlightShips.value = true;
  showNotInFlightShips.value = true;
  hideReturningToCx.value = false;
  inventorySizeFilters.value = [];
  shipClassFilters.value = [];
  conditionFilters.value = [];
  cargoStateFilters.value = [];
  etaFilters.value = [];
  fuelAlertFilter.value = 'any';
}

function getShipClass(ship: PrunApi.Ship) {
  const name = ship.name?.toUpperCase() ?? '';
  const nameMatch =
    name.match(/^\[([A-Z0-9]{2,6})]/) ??
    name.match(/^\(([A-Z0-9]{2,6})\)/) ??
    name.match(/^([A-Z0-9]{2,6})(?=[\s\-_])/);
  if (nameMatch) {
    return nameMatch[1];
  }

  const registration = ship.registration.toUpperCase();
  const match = registration.match(/^([A-Z0-9]{2,6})/);
  if (match) {
    return match[1];
  }
  return 'UNK';
}

function getConditionBand(condition: number) {
  if (condition >= 90) {
    return '100-90';
  }
  if (condition >= 80) {
    return '90-80';
  }
  return '80-0';
}

function getEtaBucket(inFlight: boolean, statusSortValue: number) {
  if (!inFlight) {
    return 'DOCKED';
  }

  const hour = 3600000;
  if (statusSortValue < hour) {
    return '<1H';
  }
  if (statusSortValue < 6 * hour) {
    return '1-6H';
  }
  if (statusSortValue < 12 * hour) {
    return '6-12H';
  }
  if (statusSortValue < 24 * hour) {
    return '12-24H';
  }
  return '>24H';
}

function getCargoState(cargoRatio: number) {
  if (cargoRatio <= 0.0001) {
    return 'EMPTY';
  }
  if (cargoRatio > 0.95) {
    return 'FULL';
  }
  return 'PARTIAL';
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
        <div :class="$style.filterTitle">Ship class</div>
        <div :class="C.ComExOrdersPanel.filter">
          <RadioItem
            v-for="shipClass in shipClassOptions"
            :key="shipClass"
            :model-value="isOptionSelected(shipClassFilters, shipClass)"
            horizontal
            @update:model-value="onShipClassClick(shipClass)">
            {{ shipClass }}
          </RadioItem>
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
        <div :class="$style.filterTitle">ETA bucket</div>
        <div :class="C.ComExOrdersPanel.filter">
          <RadioItem
            v-for="eta in etaOptions"
            :key="eta"
            :model-value="isOptionSelected(etaFilters, eta)"
            horizontal
            @update:model-value="onEtaClick(eta)">
            {{ eta }}
          </RadioItem>
        </div>
      </div>

      <div :class="$style.filterGroup">
        <div :class="$style.filterTitle">Inventory size</div>
        <div :class="C.ComExOrdersPanel.filter">
          <RadioItem
            v-for="size in inventorySizeOptions"
            :key="size"
            :model-value="isOptionSelected(inventorySizeFilters, size)"
            horizontal
            @update:model-value="onInventorySizeClick(size)">
            {{ size }}
          </RadioItem>
        </div>
      </div>

      <div :class="$style.filterGroup">
        <div :class="$style.filterTitle">Cargo state</div>
        <div :class="C.ComExOrdersPanel.filter">
          <RadioItem
            v-for="cargoState in cargoStateOptions"
            :key="cargoState"
            :model-value="isOptionSelected(cargoStateFilters, cargoState)"
            horizontal
            @update:model-value="onCargoStateClick(cargoState)">
            {{ cargoState }}
          </RadioItem>
        </div>
      </div>

      <div :class="$style.filterGroup">
        <div :class="$style.filterTitle">Condition</div>
        <div :class="C.ComExOrdersPanel.filter">
          <RadioItem
            v-for="band in conditionOptions"
            :key="band"
            :model-value="isOptionSelected(conditionFilters, band)"
            horizontal
            @update:model-value="onConditionClick(band)">
            {{ band }}
          </RadioItem>
        </div>
      </div>

      <div :class="$style.filterGroup">
        <div :class="$style.filterTitle">Route</div>
        <div :class="C.ComExOrdersPanel.filter">
          <RadioItem v-model="hideReturningToCx" horizontal>HIDE CX RETURNS</RadioItem>
        </div>
      </div>

      <div :class="$style.filterGroup">
        <div :class="$style.filterTitle">Fuel warning</div>
        <div :class="C.ComExOrdersPanel.filter">
          <RadioItem
            :model-value="fuelAlertFilter === '75'"
            horizontal
            @update:model-value="fuelAlertFilter = $event ? '75' : 'any'">
            ≤75%
          </RadioItem>
          <RadioItem
            :model-value="fuelAlertFilter === '50'"
            horizontal
            @update:model-value="fuelAlertFilter = $event ? '50' : 'any'">
            ≤50%
          </RadioItem>
          <RadioItem
            :model-value="fuelAlertFilter === '35'"
            horizontal
            @update:model-value="fuelAlertFilter = $event ? '35' : 'any'">
            ≤35%
          </RadioItem>
          <RadioItem
            :model-value="fuelAlertFilter === '25'"
            horizontal
            @update:model-value="fuelAlertFilter = $event ? '25' : 'any'">
            ≤25%
          </RadioItem>
          <RadioItem
            :model-value="fuelAlertFilter === '10'"
            horizontal
            @update:model-value="fuelAlertFilter = $event ? '10' : 'any'">
            ≤10%
          </RadioItem>
        </div>
      </div>
    </div>

    <table :class="$style.table">
      <thead>
        <tr>
          <th :class="[$style.headerCell, $style.sortable]" @click="setSort('name')">
            Name
            <span
              :class="{
                [$style.sortPrimary]: isPrimarySort('name'),
                [$style.sortSecondary]: isSecondarySort('name'),
              }">
              {{ getSortIndicator('name') }}
            </span>
          </th>
          <th :class="[$style.headerCell, $style.sortable]" @click="setSort('cargo')">
            Cargo
            <span
              :class="{
                [$style.sortPrimary]: isPrimarySort('cargo'),
                [$style.sortSecondary]: isSecondarySort('cargo'),
              }">
              {{ getSortIndicator('cargo') }}
            </span>
          </th>
          <th :class="[$style.headerCell, $style.sortable]" @click="setSort('status')">
            Status
            <span
              :class="{
                [$style.sortPrimary]: isPrimarySort('status'),
                [$style.sortSecondary]: isSecondarySort('status'),
              }">
              {{ getSortIndicator('status') }}
            </span>
          </th>
          <th :class="[$style.headerCell, $style.sortable]" @click="setSort('fuel')">
            Fuel
            <span
              :class="{
                [$style.sortPrimary]: isPrimarySort('fuel'),
                [$style.sortSecondary]: isSecondarySort('fuel'),
              }">
              {{ getSortIndicator('fuel') }}
            </span>
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
                  :class="[
                    C.ProgressBar.secondary,
                    C.ProgressBar.progress,
                    !x.isFtlCapable ? C.ProgressBar.warning : undefined,
                  ]"
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

.sortPrimary {
  color: rgb(171, 198, 128);
  font-weight: bold;
}

.sortSecondary {
  color: rgb(63, 162, 222);
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
