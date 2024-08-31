<script setup lang="ts">
import { PropType } from 'vue';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';

type Position = 'left' | 'right' | 'top' | 'bottom';

defineProps({
  tooltip: {
    type: String,
    required: true,
  },
  position: {
    type: String as PropType<Position>,
    required: true,
  },
});
</script>

<template>
  <span :data-tooltip="tooltip" :data-tooltip-position="position" :class="PrunCss.Tooltip.container"
    >ⓘ</span
  >
</template>
