<script setup lang="ts">
import { computed, useCssModule } from 'vue';

const model = defineModel<boolean>();

const $style = useCssModule();
const classes = computed(() => ({
  [$style.button]: true,
  [$style.expanded]: model.value,
}));
</script>

<template>
  <span :class="classes" @click="model = !model">▶</span>
</template>

<style module>
.button {
  display: inline-block;
  cursor: pointer;
  user-select: none;
  transform: scale(0.7);
  transition: 0.1s ease-out;
}

.expanded {
  transform: scale(0.7) rotate(90deg);
}
</style>
