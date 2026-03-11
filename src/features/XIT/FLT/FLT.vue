<script setup lang="ts">
import { computed, ref } from 'vue';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { getInvStore } from '@src/core/store-id';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import FleetStatusCell from './FleetStatusCell.vue';
import CargoBar from './CargoBar.vue';
import { fixed0 } from '@src/utils/format';

type SortKey = 'name' | 'cargo' | 'status' | 'fuel' | 'command';
type SortDirection = 'asc' | 'desc';

const sortKey = ref<SortKey>('name');
const sortDirection = ref<SortDirection>('asc');

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
    const statusSortValue = flight?.arrival.timestamp
      ? Math.max(0, flight.arrival.timestamp - now)
      : 0;

    return {
      ship,
      flight,
      inventory,
      hasItems: (inventory?.items.length ?? 0) > 0,
      stlFuelRatio,
      ftlFuelRatio,
      cargoRatio,
      fuelRatio,
      statusSortValue,
      conditionText: `${Math.round(condition)}%`,
      cargoSizeText: getCargoSizeText(inventory),
      primaryLabel: flight ? 'view' : 'fly',
    };
  });
});

const rows = computed(() => {
  const source = rawRows.value;
  if (!source) {
    return undefined;
  }

  const sign = sortDirection.value === 'asc' ? 1 : -1;
  const sorted = [...source];

  sorted.sort((a, b) => {
    switch (sortKey.value) {
      case 'name': {
        return (
          sign *
          (a.ship.name || a.ship.registration).localeCompare(b.ship.name || b.ship.registration)
        );
      }
      case 'cargo': {
        return sign * (a.cargoRatio - b.cargoRatio);
      }
      case 'status': {
        return sign * (a.statusSortValue - b.statusSortValue);
      }
      case 'fuel': {
        return sign * (a.fuelRatio - b.fuelRatio);
      }
      case 'command': {
        const aScore = (a.flight ? 1 : 0) + (a.hasItems ? 1 : 0);
        const bScore = (b.flight ? 1 : 0) + (b.hasItems ? 1 : 0);
        return sign * (aScore - bScore);
      }
    }
  });

  return sorted;
});

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

function onPrimary(registration: string) {
  showBuffer(`SFC ${registration}`);
}

function onFuel(registration: string) {
  showBuffer(`SHPF ${registration}`);
}

function onUnload(registration: string) {
  showBuffer(`SHPI ${registration}`);
}
</script>

<template>
  <LoadingSpinner v-if="!rows" />
  <table v-else :class="$style.table">
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
        <th :class="[$style.headerCell, $style.sortable]" @click="setSort('command')">
          Command{{ getSortLabel('command') }}
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

        <td :class="$style.commandCell">
          <div :class="$style.buttons">
            <button
              type="button"
              :class="[C.Button.darkInline, C.Button.dark, C.Button.btn, C.Button.inline]"
              @click="onPrimary(x.ship.registration)">
              {{ x.primaryLabel }}
            </button>
            <button
              v-if="x.hasItems"
              type="button"
              :class="[C.Button.darkInline, C.Button.dark, C.Button.btn, C.Button.inline]"
              @click="onUnload(x.ship.registration)">
              unload
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style module>
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

.commandCell {
  white-space: nowrap;
  padding: 4px 6px;
  vertical-align: middle;
}

.fuelCell {
  min-width: 120px;
}

.fuelBars {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.fuelBars > div {
  flex: 1 1 0;
  min-width: 44px;
}

.buttons {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  width: max-content;
}
</style>
