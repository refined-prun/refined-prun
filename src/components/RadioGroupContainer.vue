<script setup lang="ts">
const { horizontal = false } = defineProps<{ horizontal?: boolean }>();

const classes = computed(() => ({
  [C.RadioGroup.container]: true,
  [C.RadioGroup.horizontal]: horizontal,
}));
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
