<script setup lang="ts">
import { SortKey, useTileState } from '@src/features/XIT/FLOW/tile-state';

const { sortKey } = defineProps<{ sortKey: SortKey }>();

const sort = useTileState('sort');
const desc = useTileState('desc');

const isActive = computed(() => sort.value === sortKey);

function onClick() {
  if (isActive.value) {
    desc.value = !desc.value;
    return;
  }
  sort.value = sortKey;
  desc.value = false;
}
</script>

<template>
  <th :class="$style.header" @click="onClick">
    <slot />
    <span v-if="isActive">{{ desc ? ' ▼' : ' ▲' }}</span>
  </th>
</template>

<style module>
.header {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}
</style>
