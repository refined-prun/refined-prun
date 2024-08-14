<script setup lang="ts">
import PrunCss from '@src/prun-ui/prun-css';
import { computed } from 'vue';
import ColoredIconDetail from '@src/components/ColoredIconDetail.vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: false,
    default: undefined,
  },
  title: {
    type: String,
    required: true,
  },
  background: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

const style = computed(() => ({
  background: props.background,
  color: props.color,
}));
</script>

<template>
  <div :class="PrunCss.ColoredIcon.container" :style="style" :title="title">
    <div :class="PrunCss.ColoredIcon.labelContainer">
      <span :class="PrunCss.ColoredIcon.label">{{ label }}</span>
      <ColoredIconDetail :detail="detail" />
    </div>
  </div>
</template>
