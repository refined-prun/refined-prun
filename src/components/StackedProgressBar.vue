<script setup lang="ts">
const { danger, good, warning, max, sections } = defineProps<{
  danger?: boolean;
  good?: boolean;
  warning?: boolean;
  max: number;
  sections: {
    value: number;
    class: string;
  }[];
}>();

const $style = useCssModule();

const primary = computed(() => !good && !warning && !danger);

const value = computed(() => {
  return sumBy(sections, section => section.value);
});

const progressClass = computed(() => ({
  [C.ProgressBar.primary]: primary.value,
  [$style.good]: good,
  [$style.warning]: warning,
  [$style.danger]: danger,
}));
</script>

<template>
  <div
    :class="[C.ProgressBar.progress, progressClass, $style.stackedProgressContainer]"
    :aria-valuenow="value"
    :aria-valuemax="max">
    <div
      v-for="(section, index) in sections"
      :key="index"
      :class="[$style.stackedProgressSection, section.class]"
      :style="{ width: (section.value / max) * 100 + '%' }" />
  </div>
</template>

<style module>
.stackedProgressContainer {
  display: flex;
}

.unfilledSection {
  background: none;
}

.stackedProgressSection {
  height: 100%;
}

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
