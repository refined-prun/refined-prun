<script setup lang="ts">
const slots = defineSlots<{
  default(): VNode[];
}>();
</script>

<template>
  <div :class="C.ActionBar.container">
    <div v-for="(slot, i) in slots.default()" :key="i" :class="C.ActionBar.element">
      <component :is="slot" />
    </div>
  </div>
</template>
