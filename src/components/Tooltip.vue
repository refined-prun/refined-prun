<script setup lang="ts">
export type TooltipPosition = 'left' | 'right' | 'top' | 'bottom';

const { position = 'right' } = defineProps<{ position?: TooltipPosition; tooltip: string }>();
</script>

<template>
  <span :data-tooltip="tooltip" :data-tooltip-position="position" :class="C.Tooltip.container"
    >ⓘ</span
  >
</template>
