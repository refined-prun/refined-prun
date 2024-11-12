<script setup lang="ts">
export type TooltipPosition = 'left' | 'right' | 'top' | 'bottom';

defineProps({
  tooltip: {
    type: String,
    required: true,
  },
  position: {
    type: String as PropType<TooltipPosition>,
    default: 'right',
  },
});
</script>

<template>
  <span :data-tooltip="tooltip" :data-tooltip-position="position" :class="PrunCss.Tooltip.container"
    >ⓘ</span
  >
</template>
