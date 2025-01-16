<script setup lang="ts">
import SortCriteria from '@src/features/basic/custom-item-sorting/SortCriteria.vue';
import { objectId } from '@src/utils/object-id';

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
    v-for="mode in sorting"
    :key="objectId(mode)"
    :label="mode.label"
    :active="mode.label === activeSort"
    :reverse="reverse"
    @click="onModeClick(mode.label)" />
  <SortCriteria label="+" @click="onAddClick" />
</template>
