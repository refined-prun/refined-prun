<script setup lang="ts">
import { BaseStorageAnalysis } from '@src/core/storage-analysis';
import BaseHeader from '@src/features/XIT/STO/BaseHeader.vue';
import BaseDetail from '@src/features/XIT/STO/BaseDetail.vue';
import { useTileState } from '@src/features/XIT/STO/tile-state';

const { analysis, canMinimize } = defineProps<{
  analysis: BaseStorageAnalysis;
  canMinimize?: boolean;
}>();

const expand = useTileState('expand');
const naturalId = computed(() => analysis.naturalId);
const isMinimized = computed(() => canMinimize && !expand.value.includes(naturalId.value));

function onHeaderClick() {
  if (!canMinimize) {
    return;
  }
  if (isMinimized.value) {
    expand.value = [...expand.value, naturalId.value];
  } else {
    expand.value = expand.value.filter(x => x !== naturalId.value);
  }
}
</script>

<template>
  <tbody>
    <BaseHeader
      :has-minimize="canMinimize"
      :analysis="analysis"
      :minimized="isMinimized"
      :on-click="onHeaderClick" />
  </tbody>
  <tbody v-if="!isMinimized">
    <tr>
      <td colspan="5">
        <BaseDetail :analysis="analysis" />
      </td>
    </tr>
  </tbody>
</template>
