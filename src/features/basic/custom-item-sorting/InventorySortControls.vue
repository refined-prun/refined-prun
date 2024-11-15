<script setup lang="ts">
import SortCriteria from '@src/features/basic/custom-item-sorting/SortCriteria.vue';

defineProps({
  sorting: {
    type: Array as PropType<UserData.SortingMode[]>,
    required: true,
  },
  activeSort: {
    type: String,
    default: undefined,
  },
  reverse: Boolean,
  onModeClick: {
    type: Function as PropType<(sorting: string) => void>,
    required: true,
  },
  onAddClick: {
    type: Function as PropType<() => void>,
    required: true,
  },
});
</script>

<template>
  <SortCriteria
    v-for="mode in sorting.map(x => x.label)"
    :key="mode"
    :label="mode"
    :active="mode === activeSort"
    :reverse="reverse"
    @click="onModeClick(mode)" />
  <SortCriteria label="+" @click="onAddClick" />
</template>
