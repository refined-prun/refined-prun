<script setup lang="ts">
import grip from '@src/utils/grip.module.css';
import Checkmark from '@src/features/XIT/TODO/Checkmark.vue';
import dayjs from 'dayjs';
import { showTileOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import { ddmmyyyy } from '@src/utils/format';
import fa from '@src/utils/font-awesome.module.css';
import TaskEditor from '@src/features/XIT/TODO/EditTask.vue';
import removeArrayElement from '@src/utils/remove-array-element';
import TaskText from '@src/features/XIT/TODO/TaskText.vue';

const { list, subtask, task } = defineProps<{
  dragging?: boolean;
  list: UserData.TaskList;
  subtask?: boolean;
  task: UserData.Task;
}>();

const $style = useCssModule();

const taskClass = computed(() => [
  $style.task,
  {
    [$style.taskCompleted]: task.completed,
    [$style.subtask]: subtask,
  },
]);

function onContentClick(ev: Event) {
  if (subtask) {
    return;
  }
  showTileOverlay(ev, TaskEditor, {
    task: task,
    onDelete: () => removeArrayElement(list.tasks, task),
  });
}

function onCheckmarkClick() {
  if (task.recurring && task.dueDate) {
    task.dueDate = task.dueDate + dayjs.duration(task.recurring, 'days').asMilliseconds();
    for (const subtask of task.subtasks ?? []) {
      subtask.completed = false;
    }
  } else {
    task.completed = !task.completed;
    for (const subtask of task.subtasks ?? []) {
      subtask.completed = task.completed;
    }
  }
}
</script>

<template>
  <div>
    <div :class="taskClass">
      <div v-if="!subtask && !dragging" :class="[fa.solid, $style.grip, grip.grip]">
        {{ '\uf58e' }}
      </div>
      <Checkmark :task="task" :class="$style.checkmark" @click.stop="onCheckmarkClick" />
      <div
        :class="[$style.content, { [$style.contentCompleted]: task.completed }]"
        @click="onContentClick">
        <TaskText :text="task.text" />
        <div v-if="task.dueDate" :class="$style.dueDate">
          {{ ddmmyyyy(task.dueDate) }}
          <span v-if="task.recurring">(every {{ task.recurring }}d)</span>
        </div>
      </div>
    </div>
    <TaskItem v-for="x in task.subtasks ?? []" :key="x.id" :list="list" :task="x" subtask />
  </div>
</template>

<style module>
.task {
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  border-bottom: solid 1px #333;
  user-select: none;
  cursor: pointer;
  padding-left: 12px;
}

.subtask {
  padding-left: 27px;
  cursor: initial;
  user-select: initial;
}

.taskCompleted {
  color: #787878;
}

.grip {
  position: absolute;
  left: 0;
  top: 5px;
  cursor: move;
  transition: opacity 0.2s ease-in-out;
  opacity: 0;
}

.task:hover .grip {
  opacity: 1;
}

.checkmark {
  padding-right: 5px;
  cursor: pointer;
  user-select: none;
}

.content {
  flex: 1;
  min-height: 24px;
  padding-top: 6px;
  padding-bottom: 6px;
}

.contentCompleted {
  text-decoration: line-through;
}

.dueDate {
  color: #787878;
}
</style>
