<script setup lang="ts">
import { deleteNote, notes } from '@src/store/notes';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { showBuffer } from '@src/util';
import PrunLink from '@src/components/PrunLink.vue';
import { showTileOverlay, showConfirmationOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import CreateNoteOverlay from '@src/features/XIT/NOTE/CreateNoteOverlay.vue';

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
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Length</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="note in notes.notes" :key="note[0]">
        <td>
          <PrunLink :command="`XIT NOTES ${note[0]}`">{{ note[0] }}</PrunLink>
        </td>
        <td>
          <span
            >{{ note[1].length.toLocaleString() }} character{{
              note[1].length !== 1 ? 's' : ''
            }}</span
          >
        </td>
        <td>
          <button :class="$style.delete" @click="x => confirmDelete(x, note[0])">DELETE</button>
        </td>
      </tr>
    </tbody>
  </table>

  <button
    :class="[PrunCss.Button.btn, PrunCss.Button.primary]"
    style="margin: 5px"
    @click="createNewNote">
    NEW NOTE
  </button>
</template>

<style module>
.delete {
  color: red;
  border: none;
  cursor: pointer;
}
</style>
