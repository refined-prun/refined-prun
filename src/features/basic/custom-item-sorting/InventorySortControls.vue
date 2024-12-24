<script setup lang="ts">
import SortCriteria from '@src/features/basic/custom-item-sorting/SortCriteria.vue';

defineProps<{
  activeSort?: string;
  onAddClick: () => void;
  onModeClick: (sorting: string) => void;
  reverse?: boolean;
  sorting: UserData.SortingMode[];
}>();
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
