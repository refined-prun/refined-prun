<script setup lang="ts">
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import PrunButton from '@src/components/PrunButton.vue';
import ActionBar from '@src/components/ActionBar.vue';
import { showConfirmationOverlay, showTileOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import SortingModeEditor from './SortingModeEditor.vue';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { isEmpty } from 'ts-extras';
import { objectId } from '@src/utils/object-id';
import { getSortingData } from '@src/store/user-data-sorting';
import removeArrayElement from '@src/utils/remove-array-element';
import { vDraggable } from 'vue-draggable-plus';
import { useGrip } from '@src/components/grip/use-grip';
import GripHeaderCell from '@src/components/grip/GripHeaderCell.vue';
import GripCell from '@src/components/grip/GripCell.vue';

const parameters = useXitParameters();
const storeId = parameters[0];

const storage = computed(() => storagesStore.getById(storeId));
const sortingData = computed(() => getSortingData(storeId));

function createSortingMode(ev: Event) {
  showTileOverlay(ev, SortingModeEditor, {
    storeId,
    onSave: sorting => sortingData.value.modes.push(sorting),
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
      removeArrayElement(sortingData.value.modes, sorting);
    },
    {
      message: `Are you sure you want to delete ${sorting.label}?`,
    },
  );
}

async function copySortingMode(sorting: UserData.SortingMode) {
  const json = JSON.stringify(sorting);
  await navigator.clipboard.writeText(json);
}

async function pasteSortingMode(ev: Event) {
  const clipText = await navigator.clipboard.readText();
  const sorting = JSON.parse(clipText);

  showTileOverlay(ev, SortingModeEditor, {
    storeId,
    sorting,
    onSave: sorting => sortingData.value.modes.push(sorting),
  });
}

const grip = useGrip();
</script>

<template>
  <div v-if="!storage">Invalid inventory ID</div>
  <template v-else>
    <ActionBar>
      <PrunButton primary @click="createSortingMode">CREATE NEW</PrunButton>
      <PrunButton primary @click="pasteSortingMode">PASTE</PrunButton>
    </ActionBar>
    <table>
      <thead>
        <tr>
          <GripHeaderCell />
          <th>Name</th>
          <th>Categories</th>
          <th />
        </tr>
      </thead>
      <tbody
        v-if="!isEmpty(sortingData.modes)"
        v-draggable="[sortingData.modes, grip.draggable]"
        :class="grip.rootClass">
        <tr v-for="mode in sortingData.modes" :key="objectId(mode)">
          <GripCell />
          <td>{{ mode.label }}</td>
          <td>{{ mode.categories.map(x => x.name).join(', ') }}</td>
          <td>
            <PrunButton primary @click="editSortingMode($event, mode)">edit</PrunButton>
            <PrunButton primary @click="copySortingMode(mode)">copy</PrunButton>
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
