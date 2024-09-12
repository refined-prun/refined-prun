<script setup lang="ts">
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { VNode } from 'vue';

const slots = defineSlots<{
  default(): VNode[];
}>();
</script>

<template>
  <div :class="PrunCss.ActionBar.container">
    <div v-for="(slot, i) in slots.default()" :key="i" :class="PrunCss.ActionBar.element">
      <component :is="slot" />
    </div>
  </div>
</template>
