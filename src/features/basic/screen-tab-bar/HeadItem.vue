<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  active: Boolean,
});

const classes = computed(() => ({
  [C.HeadItem.indicator]: true,
  [C.HeadItem.indicatorPrimary]: true,
  [C.HeadItem.indicatorPrimaryActive]: props.active,
  [C.effects.shadowPrimary]: props.active,
}));
</script>

<template>
  <div :class="[C.HeadItem.container, C.fonts.fontRegular, C.type.typeRegular, C.HeadItem.link]">
    <span :class="C.HeadItem.label">{{ label }}</span>
    <div :class="classes" />
  </div>
</template>
