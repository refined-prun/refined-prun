<script setup lang="ts">
import { Component, PropType } from 'vue';

defineProps({
  component: {
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
  <Component :is="component" v-if="component" :parameters="parameters" />
  <template v-else>Error! No Matching Function!</template>
</template>
