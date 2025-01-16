<script setup lang="ts">
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import PrunButton from '@src/components/PrunButton.vue';
import ActionBar from '@src/components/ActionBar.vue';
import { showConfirmationOverlay, showTileOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import SortingModeEditor from './SortingModeEditor.vue';
import { userData } from '@src/store/user-data';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { isEmpty } from 'ts-extras';
import { objectId } from '@src/utils/object-id';

const parameters = useXitParameters();
const storeId = parameters[0];

const storage = computed(() => storagesStore.getById(storeId));
const sorting = computed(() =>
  userData.sorting.filter(x => x.storeId.toUpperCase() === storeId.toUpperCase()),
);

function createSortingMode(ev: Event) {
  showTileOverlay(ev, SortingModeEditor, {
    storeId,
    onSave: sorting => userData.sorting.push(sorting),
  });
}

function editSortingMode(ev: Event, sorting: UserData.SortingMode) {
  showTileOverlay(ev, SortingModeEditor, {
    storeId,
    sorting,
    onSave: saved => Object.assign(sorting, saved),
  });
}

function deleteSortingMode(ev: Event, sorting: UserData.SortingMode) {
  showConfirmationOverlay(
    ev,
    () => {
      userData.sorting = userData.sorting.filter(x => x !== sorting);
    },
    {
      message: `Are you sure you want to delete ${sorting.label}?`,
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
      <tbody v-if="!isEmpty(sorting)">
        <tr v-for="mode in sorting" :key="objectId(mode)">
          <td>{{ mode.label }}</td>
          <td>{{ mode.categories.map(x => x.name).join(', ') }}</td>
          <td>
            <PrunButton primary @click="editSortingMode($event, mode)">edit</PrunButton>
            <PrunButton danger @click="deleteSortingMode($event, mode)">delete</PrunButton>
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
