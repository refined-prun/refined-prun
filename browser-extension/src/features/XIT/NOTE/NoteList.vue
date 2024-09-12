<script setup lang="ts">
import { deleteNote, notes } from '@src/store/notes';
import { showBuffer } from '@src/util';
import { showTileOverlay, showConfirmationOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import CreateNoteOverlay from '@src/features/XIT/NOTE/CreateNoteOverlay.vue';
import PrunButton from '@src/components/PrunButton.vue';
import ActionBar from '@src/components/ActionBar.vue';

function createNewNote(ev: Event) {
  showTileOverlay(ev, CreateNoteOverlay, {
    onCreate: (name: string) => showBuffer(`XIT NOTE_${name}`),
  });
}

function confirmDelete(ev: Event, name: string) {
  showConfirmationOverlay(ev, () => deleteNote(name), {
    message: `Are you sure you want to delete the note "${name}"?`,
  });
}
</script>

<template>
  <ActionBar>
    <PrunButton primary @click="createNewNote">CREATE NEW</PrunButton>
  </ActionBar>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Length</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="note in notes.notes" :key="note[0]">
        <td>
          <span>{{ note[0] }}</span>
        </td>
        <td>
          <span>
            {{ note[1].length.toLocaleString() }} character{{ note[1].length !== 1 ? 's' : '' }}
          </span>
        </td>
        <td>
          <PrunButton primary @click="showBuffer(`XIT NOTES ${note[0]}`)">VIEW</PrunButton>
          <PrunButton danger @click="x => confirmDelete(x, note[0])">DELETE</PrunButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>
