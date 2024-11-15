<script setup lang="ts">
import SortingOrderIcon from './SortingOrderIcon.vue';

defineProps({
  sorting: {
    type: Array as PropType<UserData.SortingMode[]>,
    required: true,
  },
  activeSort: {
    type: String,
    default: undefined,
  },
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
  <div
    v-for="mode in sorting.map(x => x.label)"
    :key="mode"
    :class="C.InventorySortControls.criteria"
    @click="onModeClick(mode)">
    <div>{{ mode }}</div>
    <SortingOrderIcon v-if="mode === activeSort" />
  </div>
  <div :class="C.InventorySortControls.criteria" @click="onAddClick"><div>+</div></div>
</template>
