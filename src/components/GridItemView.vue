<script setup lang="ts">
defineProps({
  name: {
    type: String,
    required: false,
    default: undefined,
  },
});

const textElementClass = [C.GridItemView.name, C.fonts.fontRegular, C.type.typeRegular];
</script>

<template>
  <div :class="C.GridItemView.container">
    <div :class="C.GridItemView.image">
      <slot />
    </div>
    <span :class="textElementClass">{{ name }}</span>
  </div>
</template>
