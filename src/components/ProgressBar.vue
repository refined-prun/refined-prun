<script setup lang="ts">
const { danger, good, warning } = defineProps<{
  danger?: boolean;
  good?: boolean;
  max: number;
  value: number;
  warning?: boolean;
}>();

const $style = useCssModule();

const primary = computed(() => !good && !warning && !danger);

const progressClass = computed(() => ({
  [C.ProgressBar.primary]: primary.value,
  [$style.good]: good,
  [$style.warning]: warning,
  [$style.danger]: danger,
}));
</script>

<template>
  <progress :class="[C.ProgressBar.progress, progressClass]" :value="value" :max="max" />
</template>

<style module>
.good::-webkit-progress-value {
  background: var(--rp-color-green);
}

.warning::-webkit-progress-value {
  background: var(--rp-color-accent-primary);
}

.danger::-webkit-progress-value {
  background: var(--rp-color-red);
}
</style>
