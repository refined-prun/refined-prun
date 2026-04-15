<script setup lang="ts">
import { BaseStorageAnalysis } from '@src/core/storage-analysis';
import VisitationTable from '@src/features/XIT/STO/VisitationTable.vue';

defineProps<{ analysis: BaseStorageAnalysis }>();
</script>

<template>
  <div :class="$style.detail">
    <VisitationTable :analysis="analysis" />
  </div>
</template>

<style module>
.detail {
  padding: 0.5rem;
}
</style>
