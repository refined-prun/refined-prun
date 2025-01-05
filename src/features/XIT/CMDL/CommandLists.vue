<script setup lang="ts">
import { showTileOverlay, showConfirmationOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import CreateCommandListOverlay from './CreateCommandListOverlay.vue';
import PrunButton from '@src/components/PrunButton.vue';
import ActionBar from '@src/components/ActionBar.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { userData } from '@src/store/user-data';
import { vDraggable } from 'vue-draggable-plus';
import grip from '@src/utils/grip.module.css';
import fa from '@src/utils/font-awesome.module.css';
import PrunLink from '@src/components/PrunLink.vue';
import { createId } from '@src/store/create-id';

function createNew(ev: Event) {
  showTileOverlay(ev, CreateCommandListOverlay, {
    onCreate: (name: string) => {
      const id = createId();
      userData.commandLists.push({
        id,
        name,
        commands: [],
      });
      return showBuffer(`XIT CMDL ${id.substring(0, 8)}`);
    },
  });
}

function confirmDelete(ev: Event, list: UserData.CommandList) {
  showConfirmationOverlay(
    ev,
    () => (userData.commandLists = userData.commandLists.filter(x => x !== list)),
    {
      message: `Are you sure you want to delete the list "${list.name}"?`,
    },
  );
}

const dragging = ref(false);

const draggableOptions = {
  animation: 150,
  handle: `.${grip.grip}`,
  onStart: () => (dragging.value = true),
  onEnd: () => (dragging.value = false),
};
</script>

<template>
  <ActionBar>
    <PrunButton primary @click="createNew">CREATE NEW</PrunButton>
  </ActionBar>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Length</th>
        <th />
      </tr>
    </thead>
    <tbody
      v-draggable="[userData.commandLists, draggableOptions]"
      :class="dragging ? $style.dragging : null">
      <tr v-for="list in userData.commandLists" :key="list.id">
        <td>
          <span :class="[grip.grip, fa.solid, $style.grip]">
            {{ '\uf58e' }}
          </span>
          <PrunLink inline :command="`XIT CMDL ${list.id.substring(0, 8)}`">
            {{ list.name }}
          </PrunLink>
        </td>
        <td>
          <span>
            {{ list.commands.length }} command{{ list.commands.length !== 1 ? 's' : '' }}
          </span>
        </td>
        <td>
          <PrunButton danger @click="confirmDelete($event, list)">DELETE</PrunButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style module>
.grip {
  cursor: move;
  transition: opacity 0.2s ease-in-out;
  opacity: 0;
  margin-right: 5px;
}

tr:hover .grip {
  opacity: 1;
}

.dragging td .grip {
  opacity: 0;
}
</style>
