<script setup lang="ts">
import fa from '@src/utils/font-awesome.module.css';

const props = defineProps({
  task: {
    type: Object as PropType<UserData.Task>,
    required: true,
  },
});
</script>

<template>
  <div :class="$style.checkmark">
    <div :class="fa.regular">
      {{ '\uf111' }}
    </div>
    <div
      :class="[$style.mark, props.task.completed ? [fa.solid, $style.markCompleted] : fa.regular]">
      {{ task.completed ? '\uf058' : task.recurring ? '\uf192' : '\uf058' }}
    </div>
  </div>
</template>

<style module>
.checkmark {
  display: grid;
  position: relative;
  padding-top: 5px;
  font-size: 13px;
}

.checkmark > * {
  grid-area: 1 / 1;
}

.mark {
  transition: opacity 0.2s ease-in-out;
  opacity: 0;
}

.checkmark:hover .mark {
  opacity: 1;
}

.markCompleted {
  opacity: 1;
}
</style>
