<script setup lang="ts">
import fa from '@src/utils/font-awesome.module.css';
import { showTileOverlay } from '@src/infrastructure/prun-ui/tile-overlay';
import TaskEditor from '@src/features/XIT/TODO/EditTask.vue';
import { createId } from '@src/store/create-id';

const props = defineProps({
  list: {
    type: Object as PropType<UserData.TaskList>,
    required: true,
  },
});

function onAddClick(ev: Event) {
  const task: UserData.Task = {
    id: createId(),
    type: 'Text',
  };
  showTileOverlay(ev, TaskEditor, {
    task,
    onSave: () => props.list.tasks.push(task),
  });
}
</script>

<template>
  <div :class="$style.item" @click="onAddClick">
    <div :class="[fa.solid, $style.checkmark]">
      <div :class="$style.plus">+</div>
      <div :class="$style.plusHover">{{ '\uf055' }}</div>
    </div>
    <div :class="[$style.content]">Add task</div>
  </div>
</template>

<style module>
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: solid 1px #333;
  user-select: none;
  cursor: pointer;
}

.checkmark {
  display: grid;
  font-size: 13px;
  margin-right: 5px;
}

.checkmark > * {
  grid-area: 1 / 1;
}

.plus {
  font-size: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item:hover .plus {
  opacity: 0;
}

.plusHover {
  font-size: 14px;
  opacity: 0;
}

.item:hover .plusHover {
  opacity: 1;
}

.content {
  flex: 1;
  padding-top: 6px;
  padding-bottom: 6px;
}
</style>
