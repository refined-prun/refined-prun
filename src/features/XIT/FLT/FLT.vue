<script setup lang="ts">
import { computed } from 'vue';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import FleetStatusCell from './FleetStatusCell.vue';
import CargoBar from './CargoBar.vue';

const ships = computed(() => shipsStore.all.value);
</script>

<template>
  <LoadingSpinner v-if="!ships" />
  <table v-else :class="[C.tables.table, $style.table]">
    <thead>
      <tr>
        <th :class="$style.headerCell">Ship</th>
        <th :class="$style.headerCell">Status</th>
        <th :class="$style.headerCell">Cargo</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="ship in ships" :key="ship.id">
        <td :class="[$style.bodyCell, C.Link.link]" @click="showBuffer(`SFC ${ship.registration}`)">
          {{ ship.name || ship.registration }}
        </td>
        <td :class="$style.bodyCell">
          <FleetStatusCell :ship-id="ship.id" />
        </td>
        <td :class="[$style.bodyCell, $style.cargoCell]">
          <CargoBar :ship-id="ship.id" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style module>
.table {
  width: 100%;
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
  padding: 2px;
  padding-bottom: 0px;
}
</style>
