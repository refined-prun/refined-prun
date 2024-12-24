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

const classes = computed(() => {
  return {
    [C.ProgressBar.progress]: true,
    [C.ProgressBar.primary]: primary.value,
    [$style.good]: good,
    [$style.warning]: warning,
    [$style.danger]: danger,
  };
});
</script>

<template>
  <progress :class="classes" :value="value" :max="max" />
</template>

<style module>
.good::-webkit-progress-value {
  background: #5cb85c;
}

.warning::-webkit-progress-value {
  background: #ffc856;
}

.danger::-webkit-progress-value {
  background: #d9534f;
}
</style>
