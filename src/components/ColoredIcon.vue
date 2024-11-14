<script setup lang="ts">
import ColoredIconDetail from '@src/components/ColoredIconDetail.vue';
import { sanitizeCategoryName } from '@src/infrastructure/prun-ui/item-tracker';

export type ColoredIconSize = 'large' | 'medium' | 'small' | 'inline' | 'inline-table';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: undefined,
  },
  detail: {
    type: String,
    default: undefined,
  },
  title: {
    type: String,
    required: true,
  },
  background: {
    type: String,
    default: undefined,
  },
  color: {
    type: String,
    default: undefined,
  },
  size: {
    type: String as PropType<ColoredIconSize>,
    default: 'large',
  },
});

const $style = useCssModule();

const classes = computed(() => ({
  [C.ColoredIcon.container]: true,
  [$style.large]: props.size === 'large',
  [$style.medium]: props.size === 'medium',
  [$style.small]: props.size === 'small',
  [$style.inline]: props.size === 'inline',
  [$style.inlineTable]: props.size === 'inline-table',
  [`rp-ticker-${props.label}`]: true,
  [`rp-category-${sanitizeCategoryName(props.category ?? '')}`]: props.category !== undefined,
}));

const style = computed(() => ({
  background: props.background,
  color: props.color,
}));
</script>

<template>
  <div :class="classes" :style="style" :title="title">
    <div :class="C.ColoredIcon.labelContainer">
      <span :class="C.ColoredIcon.label">{{ label }}</span>
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

.inlineTable {
  height: 18px;
  width: 32px;
  font-size: 11px;
}
</style>
