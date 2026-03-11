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
  <table v-else :class="[C.Table.table, C.Table.fixed]">
    <thead>
      <tr>
        <th :class="C.Table.header">Ship</th>
        <th :class="C.Table.header">Status</th>
        <th :class="C.Table.header">Cargo</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="ship in ships" :key="ship.id">
        <td :class="[C.Table.cell, C.Link.link]" @click="showBuffer(`SFC ${ship.registration}`)">
          {{ ship.name || ship.registration }}
        </td>
        <td :class="C.Table.cell">
          <FleetStatusCell :ship-id="ship.id" />
        </td>
        <td :class="[C.Table.cell, $style.cargoCell]">
          <CargoBar :ship-id="ship.id" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style module>
.cargoCell {
  padding: 2px;
  padding-bottom: 0px;
}
</style>
