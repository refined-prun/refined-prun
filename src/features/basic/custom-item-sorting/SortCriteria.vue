<script setup lang="ts">
import SortingOrderIcon from './SortingOrderIcon.vue';

defineProps({
  label: {
    type: String,
    required: true,
  },
  active: Boolean,
  reverse: Boolean,
  onClick: {
    type: Function as PropType<() => void>,
    default: () => {},
  },
});
</script>

<template>
  <div :class="C.InventorySortControls.criteria" @click="onClick">
    <div>{{ label }}</div>
    <SortingOrderIcon v-if="active" :reverse="reverse" />
  </div>
</template>
