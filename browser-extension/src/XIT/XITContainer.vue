<script setup lang="ts">
import { Component, PropType } from 'vue';

defineProps({
  buffer: {
    type: Object as PropType<Component>,
    default: undefined,
  },
  parameters: {
    type: Array<string>,
    required: true,
  },
});
</script>

<template>
  <div :class="$style.container">
    <Component :is="buffer" v-if="buffer" :parameters="parameters" />
    <template v-else>Error! No Matching Function!</template>
  </div>
</template>

<style module>
.container {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #222;
}
</style>
