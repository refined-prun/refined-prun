<script setup lang="ts">
import ActionBar from '@src/components/ActionBar.vue';
import PrunButton from '@src/components/PrunButton.vue';
import PrunLink from '@src/components/PrunLink.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { showConfirmationOverlay, showTileOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import CreateStockPreset from '@src/features/XIT/STOCK/CreateStockPreset.vue';
import { userData } from '@src/store/user-data';
import removeArrayElement from '@src/utils/remove-array-element';
import { objectId } from '@src/utils/object-id';
import { vDraggable } from 'vue-draggable-plus';
import { grip } from '@src/components/grip';
import GripCell from '@src/components/grip/GripCell.vue';
import GripHeaderCell from '@src/components/grip/GripHeaderCell.vue';

const stockPresets = computed(() => userData.stockPresets);

function onCreateClick(ev: Event) {
  showTileOverlay(ev, CreateStockPreset, {
    onCreate: name => {
      userData.stockPresets.push({ name, planets: [] });
      showBuffer('XIT STOCK_EDIT_' + paramName(name));
    },
  });
}

function onDeleteClick(ev: Event, preset: UserData.StockPresetData) {
  showConfirmationOverlay(ev, () => removeArrayElement(userData.stockPresets, preset), {
    message: `Are you sure you want to delete the stock preset "${preset.name}"?`,
    confirmLabel: 'DELETE',
  });
}

function paramName(name: string) {
  return name.split(' ').join('_');
}
</script>

<template>
  <ActionBar>
    <PrunButton primary @click="onCreateClick">CREATE NEW</PrunButton>
  </ActionBar>
  <table>
    <thead>
      <tr>
        <GripHeaderCell />
        <th>Name</th>
        <th>Open</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody v-if="stockPresets.length === 0">
      <tr>
        <td colspan="5">No stock presets.</td>
      </tr>
    </tbody>
    <tbody v-else v-draggable="[stockPresets, grip.draggable]">
      <tr v-for="preset in stockPresets" :key="objectId(preset)">
        <GripCell />
        <td>
          <PrunLink inline :command="`XIT STOCK_${paramName(preset.name)}`">
            {{ preset.name }}
          </PrunLink>
        </td>
        <td>
          <PrunButton primary @click="showBuffer(`XIT STOCK_${paramName(preset.name)}`)">
            OPEN
          </PrunButton>
        </td>
        <td>
          <PrunButton primary @click="showBuffer(`XIT STOCK_EDIT_${paramName(preset.name)}`)">
            EDIT
          </PrunButton>
        </td>
        <td>
          <PrunButton dark inline @click="onDeleteClick($event, preset)">delete</PrunButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>
