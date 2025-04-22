<script setup lang="ts">
import fa from '@src/utils/font-awesome.module.css';

defineProps<{ task: UserData.Task }>();
</script>

<template>
  <div :class="$style.checkmark">
    <div :class="[fa.regular, $style.circle]">
      {{ '\uf111' }}
    </div>
    <div :class="[$style.mark, task.completed ? [fa.solid, $style.markCompleted] : fa.regular]">
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

.circle {
  grid-area: 1 / 1;
}

.mark {
  grid-area: 1 / 1;
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
