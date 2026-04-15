<script setup lang="ts">
import { BaseStorageAnalysis } from '@src/core/storage-analysis';
import StorageTable from '@src/features/XIT/STO/StorageTable.vue';
import VisitationTable from '@src/features/XIT/STO/VisitationTable.vue';

defineProps<{ analysis: BaseStorageAnalysis }>();
</script>

<template>
  <div :class="$style.detail">
    <StorageTable :analysis="analysis" />
    <VisitationTable :analysis="analysis" />
  </div>
</template>

<style module>
.detail {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.5rem;
}
</style>
