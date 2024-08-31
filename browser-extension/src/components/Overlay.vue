<script setup lang="ts">
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { Component, PropType } from 'vue';

defineProps({
  child: {
    type: Object as PropType<Component>,
    required: true,
  },
  props: {
    type: Object,
    default: () => {},
  },
  onClose: {
    type: Function as PropType<() => void>,
    required: true,
  },
});
</script>

<template>
  <div :class="PrunCss.Overlay.overlay">
    <div :class="[PrunCss.Overlay.background, PrunCss.Overlay.overlay]">
      <div :class="PrunCss.Overlay.close" @click="onClose" />
      <div :class="PrunCss.Overlay.children">
        <Component :is="child" v-bind="props" @close="onClose" />
      </div>
      <div :class="PrunCss.Overlay.close" @click="onClose" />
    </div>
  </div>
</template>
