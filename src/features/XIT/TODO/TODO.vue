<script setup lang="ts">
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { userData } from '@src/store/user-data';
import { isEmpty } from 'ts-extras';
import TaskList from '@src/features/XIT/TODO/TaskList.vue';
import TaskLists from '@src/features/XIT/TODO/TaskLists.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { createId } from '@src/store/create-id';

const parameters = useXitParameters();
const name = parameters.join(' ');
const list = computed(() => {
  const byId = userData.todo.find(x => x.id.toUpperCase().startsWith(parameters[0].toUpperCase()));
  if (byId) {
    return byId;
  }
  return userData.todo.find(x => x.name === name);
});

function onCreateClick() {
  userData.todo.push({
    id: createId(),
    name,
    tasks: [],
  });
}
</script>

<template>
  <TaskLists v-if="isEmpty(parameters)" />
  <TaskList v-else-if="list" :list="list" />
  <div v-else :class="$style.create">
    <span>Task list "{{ name }}" not found.</span>
    <PrunButton primary :class="$style.button" @click="onCreateClick">CREATE</PrunButton>
  </div>
</template>

<style module>
.create {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.button {
  margin-top: 5px;
}
</style>
