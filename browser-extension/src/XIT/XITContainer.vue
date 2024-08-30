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
  <Component :is="buffer" v-if="buffer" :parameters="parameters" />
  <template v-else>Error! No Matching Function!</template>
</template>
