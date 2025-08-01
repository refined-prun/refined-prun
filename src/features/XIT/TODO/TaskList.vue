<script setup lang="ts">
import grip from '@src/utils/grip.module.css';
import TaskItem from '@src/features/XIT/TODO/TaskItem.vue';
import AddTaskItem from '@src/features/XIT/TODO/AddTaskItem.vue';
import { vDraggable } from 'vue-draggable-plus';
import Header from '@src/components/Header.vue';

defineProps<{ list: UserData.TaskList }>();

const dragging = ref(false);

const draggableOptions = {
  animation: 150,
  handle: `.${grip.grip}`,
  onStart: () => (dragging.value = true),
  onEnd: () => (dragging.value = false),
};
</script>

<template>
  <div :class="$style.root">
    <Header v-model="list.name" editable :class="$style.header" />
    <div v-draggable="[list.tasks, draggableOptions]" :class="$style.list">
      <TaskItem
        v-for="task in list.tasks"
        :key="task.id"
        :list="list"
        :task="task"
        :dragging="dragging" />
    </div>
    <AddTaskItem :list="list" />
  </div>
</template>

<style module>
.root {
  padding-left: 10px;
  padding-top: 10px;
}

.header {
  margin-left: 10px;
}

.list {
  padding-top: 5px;
  padding-right: 3px;
}
</style>
