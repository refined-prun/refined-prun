<script setup lang="ts">
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { userData } from '@src/store/user-data';
import { isEmpty } from 'ts-extras';
import TaskList from '@src/features/XIT/TODO/TaskList.vue';
import TaskLists from '@src/features/XIT/TODO/TaskLists.vue';

const parameters = useXitParameters();
const list = computed(() => {
  const byId = userData.todo.find(x => x.id.toUpperCase().startsWith(parameters[0].toUpperCase()));
  if (byId) {
    return byId;
  }
  const name = parameters.join(' ');
  return userData.todo.find(x => x.name === name);
});
</script>

<template>
  <TaskLists v-if="isEmpty(parameters)" />
  <TaskList v-else-if="list" :list="list" />
  <div v-else>Task list not found.</div>
</template>
