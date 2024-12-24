<script setup lang="ts">
const { active } = defineProps<{ active?: boolean; label: string }>();

const classes = computed(() => ({
  [C.HeadItem.indicator]: true,
  [C.HeadItem.indicatorPrimary]: true,
  [C.HeadItem.indicatorPrimaryActive]: active,
  [C.effects.shadowPrimary]: active,
}));
</script>

<template>
  <div :class="[C.HeadItem.container, C.fonts.fontRegular, C.type.typeRegular, C.HeadItem.link]">
    <span :class="C.HeadItem.label">{{ label }}</span>
    <div :class="classes" />
  </div>
</template>
