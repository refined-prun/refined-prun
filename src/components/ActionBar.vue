<script setup lang="ts">
import { objectId } from '@src/utils/object-id';

const slots = defineSlots<{
  default(): VNode[];
}>();
</script>

<template>
  <div :class="C.ActionBar.container">
    <div v-for="slot in slots.default()" :key="objectId(slot)" :class="C.ActionBar.element">
      <component :is="slot" />
    </div>
  </div>
</template>
