<script setup lang="ts">
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { computed, PropType, useCssModule } from 'vue';
import ColoredIconDetail from '@src/components/ColoredIconDetail.vue';

export type ColoredIconSize = 'large' | 'medium' | 'small' | 'inline';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: false,
    default: undefined,
  },
  title: {
    type: String,
    required: true,
  },
  background: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String as PropType<ColoredIconSize>,
    default: 'large',
  },
});

const $style = useCssModule();

const classes = computed(() => ({
  [PrunCss.ColoredIcon.container]: true,
  [$style.large]: props.size === 'large',
  [$style.medium]: props.size === 'medium',
  [$style.small]: props.size === 'small',
  [$style.inline]: props.size === 'inline',
}));

const style = computed(() => ({
  background: props.background,
  color: props.color,
}));
</script>

<template>
  <div :class="classes" :style="style" :title="title">
    <div :class="PrunCss.ColoredIcon.labelContainer">
      <span :class="PrunCss.ColoredIcon.label">{{ label }}</span>
      <ColoredIconDetail :detail="detail" />
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
</style>
