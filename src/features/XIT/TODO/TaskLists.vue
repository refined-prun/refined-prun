<script setup lang="ts">
import { showTileOverlay, showConfirmationOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import PrunButton from '@src/components/PrunButton.vue';
import ActionBar from '@src/components/ActionBar.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { userData } from '@src/store/user-data';
import { vDraggable } from 'vue-draggable-plus';
import CreateTaskList from '@src/features/XIT/TODO/CreateTaskList.vue';
import { createId } from '@src/store/create-id';
import removeArrayElement from '@src/utils/remove-array-element';
import { sumBy } from '@src/utils/sum-by';
import PrunLink from '@src/components/PrunLink.vue';
import { ddmmyyyy } from '@src/utils/format';

function createNewList(ev: Event) {
  showTileOverlay(ev, CreateTaskList, {
    onCreate: (name: string) => {
      const id = createId();
      userData.todo.push({ id, name, tasks: [] });
      return showBuffer(`XIT TODO ${id.substring(0, 8)}`);
    },
  });
}

function confirmDelete(ev: Event, list: UserData.TaskList) {
  showConfirmationOverlay(ev, () => removeArrayElement(userData.todo, list), {
    message: `Are you sure you want to delete the task list "${list.name}"?`,
  });
}

function countCompletedTasks(list: UserData.TaskList) {
  return sumBy(list.tasks, x => (x.completed ? 1 : 0));
}

function getDueDate(list: UserData.TaskList) {
  const dates: string[] = [];
  const add = (task: UserData.Task) => {
    if (task.dueDate) {
      dates.push(task.dueDate);
    }
    for (const subtask of task.subtasks ?? []) {
      add(subtask);
    }
  };
  for (const task of list.tasks) {
    add(task);
  }
  if (dates.length === 0) {
    return undefined;
  }
  dates.sort();
  return ddmmyyyy(new Date(dates[0]));
}
</script>

<template>
  <ActionBar>
    <PrunButton primary @click="createNewList">CREATE NEW</PrunButton>
  </ActionBar>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Tasks</th>
        <th>Due Date</th>
        <th />
      </tr>
    </thead>
    <tbody v-draggable="[userData.todo, { animation: 150 }]">
      <tr v-for="list in userData.todo" :key="list.id">
        <td>
          <PrunLink :command="`XIT TODO ${list.id.substring(0, 8)}`">{{ list.name }}</PrunLink>
        </td>
        <td>
          <span>{{ countCompletedTasks(list) }}/{{ list.tasks.length }}</span>
        </td>
        <td>
          <span>{{ getDueDate(list) }}</span>
        </td>
        <td>
          <PrunButton danger @click="confirmDelete($event, list)">DELETE</PrunButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>
