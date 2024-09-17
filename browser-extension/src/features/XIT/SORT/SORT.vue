<script setup lang="ts">
import { computed } from 'vue';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import PrunButton from '@src/components/PrunButton.vue';
import ActionBar from '@src/components/ActionBar.vue';
import { showConfirmationOverlay, showTileOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import SortingModeEditor from './SortingModeEditor.vue';
import { userData } from '@src/store/user-data';

const props = defineProps({
  parameters: {
    type: Array<string>,
    required: true,
  },
});

const storeId = computed(() => props.parameters[1]);
const storage = computed(() => storagesStore.getById(storeId.value));
const sortingModes = computed(() =>
  userData.sortingModes.filter(x => x.storeId.toUpperCase() === storeId.value.toUpperCase()),
);

function createSortingMode(ev: Event) {
  showTileOverlay(ev, SortingModeEditor, {
    storeId: storeId.value,
    onSave: (sortingMode: UserData.SortingMode) => userData.sortingModes.push(sortingMode),
  });
}

function editSortingMode(ev: Event, sortingMode: UserData.SortingMode) {
  showTileOverlay(ev, SortingModeEditor, {
    storeId: storeId.value,
    sortingMode,
    onSave: (saved: UserData.SortingMode) => Object.assign(sortingMode, saved),
  });
}

function deleteSortingMode(ev: Event, sortingMode: UserData.SortingMode) {
  showConfirmationOverlay(
    ev,
    () => {
      userData.sortingModes = userData.sortingModes.sorting.filter(x => x !== sortingMode);
    },
    {
      message: `Are you sure you want to delete ${sortingMode.label}?`,
    },
  );
}
</script>

<template>
  <div v-if="!storage">Invalid inventory ID</div>
  <template v-else>
    <ActionBar>
      <PrunButton primary @click="createSortingMode">CREATE NEW</PrunButton>
    </ActionBar>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Categories</th>
          <th />
        </tr>
      </thead>
      <tbody v-if="sortingModes.length > 0">
        <tr v-for="mode in sortingModes" :key="mode.label">
          <td>{{ mode.label }}</td>
          <td>{{ mode.categories.map(x => x.name).join(', ') }}</td>
          <td>
            <PrunButton primary @click="ev => editSortingMode(ev, mode)">edit</PrunButton>
            <PrunButton danger @click="ev => deleteSortingMode(ev, mode)">delete</PrunButton>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="3">No Sorting Options</td>
        </tr>
      </tbody>
    </table>
  </template>
</template>

<style module></style>
