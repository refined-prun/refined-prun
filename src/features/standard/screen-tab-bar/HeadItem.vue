<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  active: Boolean,
});

const classes = computed(() => ({
  [PrunCss.HeadItem.indicator]: true,
  [PrunCss.HeadItem.indicatorPrimary]: true,
  [PrunCss.HeadItem.indicatorPrimaryActive]: props.active,
  [PrunCss.effects.shadowPrimary]: props.active,
}));
</script>

<template>
  <div
    :class="[
      PrunCss.HeadItem.container,
      PrunCss.fonts.fontRegular,
      PrunCss.type.typeRegular,
      PrunCss.HeadItem.link,
    ]">
    <span :class="PrunCss.HeadItem.label">{{ label }}</span>
    <div :class="classes" />
  </div>
</template>
