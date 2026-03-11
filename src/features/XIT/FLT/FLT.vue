<script setup lang="ts">
import { computed } from 'vue';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { getInvStore } from '@src/core/store-id';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import FleetStatusCell from './FleetStatusCell.vue';
import CargoBar from './CargoBar.vue';

const rows = computed(() => {
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

    return {
      ship,
      flight,
      hasItems: (inventory?.items.length ?? 0) > 0,
      stlFuelRatio,
      ftlFuelRatio,
      conditionText: `${Math.round(condition)}%`,
      primaryLabel: flight ? 'view' : 'fly',
    };
  });
});

function onPrimary(registration: string) {
  showBuffer(`SFC ${registration}`);
}

function onCargo(registration: string) {
  showBuffer(`SHPI ${registration}`);
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
        <th :class="$style.headerCell">Name</th>
        <th :class="$style.headerCell">Cargo</th>
        <th :class="$style.headerCell">Status</th>
        <th :class="$style.headerCell">Fuel</th>
        <th :class="$style.headerCell">Command</th>
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
        </td>

        <td :class="$style.bodyCell">
          <FleetStatusCell :ship-id="x.ship.id" />
        </td>

        <td :class="$style.bodyCell">
          <div :class="[C.ShipFuel.container, C.ShipFuel.pointer]">
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
              type="button"
              :class="[C.Button.darkInline, C.Button.dark, C.Button.btn, C.Button.inline]"
              @click="onCargo(x.ship.registration)">
              cargo
            </button>
            <button
              type="button"
              :class="[C.Button.darkInline, C.Button.dark, C.Button.btn, C.Button.inline]"
              @click="onFuel(x.ship.registration)">
              fuel
            </button>
            <button
              type="button"
              :disabled="!x.hasItems"
              :class="[
                x.hasItems ? C.Button.darkInline : C.Button.disabledInline,
                x.hasItems ? C.Button.dark : C.Button.disabled,
                C.Button.btn,
                C.Button.inline,
              ]"
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

.bodyCell {
  padding: 4px 6px;
  vertical-align: middle;
}

.cargoCell {
  min-width: 70px;
  padding: 2px;
  padding-bottom: 0px;
}

.commandCell {
  white-space: nowrap;
  padding: 4px 6px;
  vertical-align: middle;
}

.buttons {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  width: max-content;
}
</style>
