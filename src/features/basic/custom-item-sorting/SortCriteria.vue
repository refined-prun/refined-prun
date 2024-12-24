<script setup lang="ts">
import SortingOrderIcon from './SortingOrderIcon.vue';

defineProps<{
  active?: boolean;
  label: string;
  reverse?: boolean;
}>();
</script>

<template>
  <div :class="C.InventorySortControls.criteria">
    <div>{{ label }}</div>
    <SortingOrderIcon v-if="active" :reverse="reverse" />
  </div>
</template>
