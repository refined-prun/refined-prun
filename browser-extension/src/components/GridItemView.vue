<script setup lang="ts">
import PrunCss from '@src/infrastructure/prun-ui/prun-css';

defineProps({
  name: {
    type: String,
    required: false,
    default: undefined,
  },
});

const textElementClass = [
  PrunCss.GridItemView.name,
  PrunCss.fonts.fontRegular,
  PrunCss.type.typeRegular,
];
</script>

<template>
  <div :class="PrunCss.GridItemView.container">
    <div :class="PrunCss.GridItemView.image">
      <slot />
      <span :class="textElementClass">{{ name }}</span>
    </div>
  </div>
</template>
