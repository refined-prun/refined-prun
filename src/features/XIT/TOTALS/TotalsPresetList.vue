<script setup lang="ts">
import ActionBar from '@src/components/ActionBar.vue';
import PrunButton from '@src/components/PrunButton.vue';
import PrunLink from '@src/components/PrunLink.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { showConfirmationOverlay, showTileOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import CreateTotalsPreset from '@src/features/XIT/TOTALS/CreateTotalsPreset.vue';
import { userData } from '@src/store/user-data';
import removeArrayElement from '@src/utils/remove-array-element';
import { objectId } from '@src/utils/object-id';
import { vDraggable } from 'vue-draggable-plus';
import { grip } from '@src/components/grip';
import GripCell from '@src/components/grip/GripCell.vue';
import GripHeaderCell from '@src/components/grip/GripHeaderCell.vue';
import { toParamName } from '@src/features/XIT/TOTALS/utils';

const presets = computed(() => userData.itemTotalsPresets);

function onCreateClick(ev: Event) {
  showTileOverlay(ev, CreateTotalsPreset, {
    onCreate: name => {
      userData.itemTotalsPresets.push({ name, items: [] });
      showBuffer(`XIT TOTALS_EDIT_${toParamName(name)}`);
    },
  });
}

function onDeleteClick(ev: Event, preset: UserData.ItemTotalsPresetData) {
  showConfirmationOverlay(ev, () => removeArrayElement(userData.itemTotalsPresets, preset), {
    message: `Are you sure you want to delete the totals preset "${preset.name}"?`,
    confirmLabel: 'DELETE',
  });
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
    <tbody v-if="presets.length === 0">
      <tr>
        <td colspan="5">No totals presets.</td>
      </tr>
    </tbody>
    <tbody v-else v-draggable="[presets, grip.draggable]">
      <tr v-for="preset in presets" :key="objectId(preset)">
        <GripCell />
        <td>
          <PrunLink inline :command="`XIT TOTALS_${toParamName(preset.name)}`">
            {{ preset.name }}
          </PrunLink>
        </td>
        <td>
          <PrunButton primary @click="showBuffer(`XIT TOTALS_${toParamName(preset.name)}`)">
            OPEN
          </PrunButton>
        </td>
        <td>
          <PrunButton primary @click="showBuffer(`XIT TOTALS_EDIT_${toParamName(preset.name)}`)">
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
