<script setup lang="ts">
const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  good: Boolean,
  warning: Boolean,
  danger: Boolean,
});

const $style = useCssModule();

const primary = computed(() => !props.good && !props.warning && !props.danger);

const classes = computed(() => {
  return {
    [C.ProgressBar.progress]: true,
    [C.ProgressBar.primary]: primary.value,
    [$style.good]: props.good,
    [$style.warning]: props.warning,
    [$style.danger]: props.danger,
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
