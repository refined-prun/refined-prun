<script setup lang="ts">
export type ColoredIconSize = 'large' | 'medium' | 'small' | 'inline' | 'inline-table';

const {
  background,
  color,
  label,
  subLabel,
  size = 'large',
} = defineProps<{
  background?: string;
  color?: string;
  subLabel?: string;
  label: string;
  size?: ColoredIconSize;
  title: string;
}>();

const $style = useCssModule();

const containerClass = computed(() => ({
  [$style.large]: size === 'large',
  [$style.medium]: size === 'medium',
  [$style.small]: size === 'small',
  [$style.inline]: size === 'inline',
  [$style.inlineTable]: size === 'inline-table',
}));

const isSubLabelVisible = computed(() => subLabel && (size === 'large' || size === 'medium'));

const subLabelClasses = [
  C.ColoredIcon.subLabel,
  C.type.typeVerySmall,
  {
    [$style.mediumSubLabel]: size === 'medium',
  },
];
</script>

<template>
  <div
    :class="[C.ColoredIcon.container, containerClass]"
    :style="{ background, color }"
    :title="title">
    <div :class="C.ColoredIcon.labelContainer">
      <span :class="C.ColoredIcon.label">{{ label }}</span>
      <span v-if="isSubLabelVisible" :class="subLabelClasses">{{ subLabel }}</span>
    </div>
  </div>
</template>

<style module>
.large {
  height: 48px;
  width: 48px;
  font-size: 16px;
}

.medium {
  height: 32px;
  width: 32px;
  font-size: 11px;
}

.small {
  height: 24px;
  width: 24px;
  font-size: 9px;
}

.inline {
  height: 14px;
  width: 32px;
  font-size: 11px;
}

.inlineTable {
  height: 18px;
  width: 32px;
  font-size: 11px;
}

.mediumSubLabel {
  font-size: 7px;
}
</style>
