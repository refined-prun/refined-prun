<script setup lang="ts">
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { PropType } from 'vue';
import { SortingMode } from '@src/store/settings';
import SortingOrderIcon from '@src/features/standard/inv-custom-sorting/SortingOrderIcon.vue';

defineProps({
  sortingModes: {
    type: Array as PropType<SortingMode[]>,
    required: true,
  },
  activeSort: {
    type: String,
    default: undefined,
  },
  onModeClick: {
    type: Function as PropType<(sortingMode: string) => void>,
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
    v-for="mode in sortingModes.map(x => x.label)"
    :key="mode"
    :class="PrunCss.InventorySortControls.criteria"
    @click="onModeClick(mode)">
    <div>{{ mode }}</div>
    <SortingOrderIcon v-if="mode === activeSort" />
  </div>
  <div :class="PrunCss.InventorySortControls.criteria" @click="onAddClick"><div>+</div></div>
</template>
