<script setup lang="ts">
import { deleteNote, Note, notes } from '@src/store/notes';
import { showTileOverlay, showConfirmationOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import CreateNoteOverlay from '@src/features/XIT/NOTE/CreateNoteOverlay.vue';
import PrunButton from '@src/components/PrunButton.vue';
import ActionBar from '@src/components/ActionBar.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

function createNewNote(ev: Event) {
  showTileOverlay(ev, CreateNoteOverlay, {
    onCreate: (name: string) => showBuffer(`XIT NOTE ${sanitizeNoteName(name)}`),
  });
}

function confirmDelete(ev: Event, note: Note) {
  showConfirmationOverlay(ev, () => deleteNote(note), {
    message: `Are you sure you want to delete the note "${note[0]}"?`,
  });
}

function sanitizeNoteName(name: string) {
  return name.replaceAll(' ', '_');
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
          <PrunButton primary @click="showBuffer(`XIT NOTES ${sanitizeNoteName(note[0])}`)">
            VIEW
          </PrunButton>
          <PrunButton danger @click="x => confirmDelete(x, note)">DELETE</PrunButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>
