<script setup lang="ts">
import ActionBar from '@src/components/ActionBar.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { createId } from '@src/store/create-id';
import PrunLink from '@src/components/PrunLink.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import { vDraggable } from 'vue-draggable-plus';
import grip from '@src/utils/grip.module.css';
import fa from '@src/utils/font-awesome.module.css';

const { list } = defineProps<{ list: UserData.CommandList }>();

const edit = ref(false);

function addCommand() {
  list.commands.push({
    id: createId(),
    label: 'Help',
    command: 'XIT HELP',
  });
}

function deleteCommand(command: UserData.Command) {
  list.commands = list.commands.filter(x => x !== command);
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
  <template v-if="!edit">
    <table>
      <thead>
        <tr>
          <th>Commands</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="list.commands.length === 0">
          <td>No commands.</td>
        </tr>
        <template v-else>
          <tr v-for="command in list.commands" :key="command.id">
            <td>
              <PrunLink :command="command.command">{{ command.label }}</PrunLink>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <ActionBar>
      <PrunButton primary @click="edit = true">EDIT</PrunButton>
    </ActionBar>
  </template>
  <template v-else>
    <table>
      <thead>
        <tr>
          <th>Label</th>
          <th>Command</th>
          <th />
        </tr>
      </thead>
      <template v-if="list.commands.length === 0">
        <tbody>
          <tr>
            <td>No commands.</td>
          </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody
          v-draggable="[list.commands, draggableOptions]"
          :class="dragging ? $style.dragging : null">
          <tr v-for="command in list.commands" :key="command.id">
            <td>
              <span :class="[grip.grip, fa.solid, $style.grip]">
                {{ '\uf58e' }}
              </span>
              <div :class="[C.forms.input, $style.inline]">
                <TextInput v-model="command.label" />
              </div>
            </td>
            <td>
              <div :class="C.forms.input">
                <TextInput v-model="command.command" />
              </div>
            </td>
            <td>
              <PrunButton danger @click="deleteCommand(command)">DELETE</PrunButton>
            </td>
          </tr>
        </tbody>
      </template>
    </table>
    <ActionBar>
      <PrunButton primary @click="addCommand">ADD COMMAND</PrunButton>
      <PrunButton primary @click="edit = false">DONE</PrunButton>
    </ActionBar>
  </template>
</template>

<style module>
.inline {
  display: inline-block;
}

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
