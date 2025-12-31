<script setup lang="ts">
import { showTileOverlay, showConfirmationOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import CreateNoteOverlay from '@src/features/XIT/NOTE/CreateNoteOverlay.vue';
import PrunButton from '@src/components/PrunButton.vue';
import ActionBar from '@src/components/ActionBar.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { userData } from '@src/store/user-data';
import { createNote, deleteNote } from '@src/store/notes';
import { vDraggable } from 'vue-draggable-plus';
import { useGrip } from '@src/components/grip/use-grip';
import GripHeaderCell from '@src/components/grip/GripHeaderCell.vue';
import GripCell from '@src/components/grip/GripCell.vue';
import PrunLink from '@src/components/PrunLink.vue';

function createNewNote(ev: Event) {
  showTileOverlay(ev, CreateNoteOverlay, {
    onCreate: name => {
      const id = createNote(name);
      showBuffer(`XIT NOTE ${id}`);
    },
  });
}

function confirmDelete(ev: Event, note: UserData.Note) {
  showConfirmationOverlay(ev, () => deleteNote(note), {
    message: `Are you sure you want to delete the note "${note.name}"?`,
  });
}

const grip = useGrip();
</script>

<template>
  <ActionBar>
    <PrunButton primary @click="createNewNote">CREATE NEW</PrunButton>
  </ActionBar>
  <table>
    <thead>
      <tr>
        <GripHeaderCell />
        <th>Name</th>
        <th>Length</th>
        <th />
      </tr>
    </thead>
    <tbody v-draggable="[userData.notes, grip.draggable]" :class="grip.rootClass">
      <tr v-for="note in userData.notes" :key="note.id">
        <GripCell />
        <td>
          <PrunLink inline :command="`XIT NOTE ${note.id.substring(0, 8)}`">
            {{ note.name }}
          </PrunLink>
        </td>
        <td>
          <span>
            {{ note.text.length.toLocaleString() }} character{{ note.text.length !== 1 ? 's' : '' }}
          </span>
        </td>
        <td>
          <PrunButton danger @click="confirmDelete($event, note)">DELETE</PrunButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>
