<script setup lang="ts">
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
  position: relative;
  transform: scale(0.7);
  transition: 0.1s ease-out;
}

.button::before {
  content: '';
  position: absolute;
  /* Increases clickable area */
  top: -5px;
  bottom: -5px;
  left: -5px;
  right: -5px;
  /* Invisible but expands hitbox */
  background: transparent;
  z-index: -1;
}

.expanded {
  transform: scale(0.7) rotate(90deg);
}
</style>
