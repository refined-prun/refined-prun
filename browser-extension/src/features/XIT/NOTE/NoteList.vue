<script setup lang="ts">
import { showTileOverlay, showConfirmationOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import CreateNoteOverlay from '@src/features/XIT/NOTE/CreateNoteOverlay.vue';
import PrunButton from '@src/components/PrunButton.vue';
import ActionBar from '@src/components/ActionBar.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { userData } from '@src/store/user-data';
import { createNote, deleteNote } from '@src/store/notes';

function createNewNote(ev: Event) {
  showTileOverlay(ev, CreateNoteOverlay, {
    onCreate: (name: string) => {
      const id = createNote(name);
      return showBuffer(`XIT NOTE ${id}`);
    },
  });
}

function confirmDelete(ev: Event, note: UserData.Note) {
  showConfirmationOverlay(ev, () => deleteNote(note), {
    message: `Are you sure you want to delete the note "${note.name}"?`,
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
      <tr v-for="note in userData.notes" :key="note.id">
        <td>
          <span>{{ note.name }}</span>
        </td>
        <td>
          <span>
            {{ note.text.length.toLocaleString() }} character{{ note.text.length !== 1 ? 's' : '' }}
          </span>
        </td>
        <td>
          <PrunButton primary @click="showBuffer(`XIT NOTE ${note.id}`)">VIEW</PrunButton>
          <PrunButton danger @click="confirmDelete($event, note)">DELETE</PrunButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>
