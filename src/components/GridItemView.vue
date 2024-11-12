<script setup lang="ts">
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
    </div>
    <span :class="textElementClass">{{ name }}</span>
  </div>
</template>
