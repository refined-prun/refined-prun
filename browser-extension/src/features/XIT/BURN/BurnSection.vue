<script setup lang="ts">
import { computed, PropType } from 'vue';
import { PlanetBurn } from '@src/core/burn';
import PlanetHeader from '@src/features/XIT/BURN/PlanetHeader.vue';
import MaterialList from '@src/features/XIT/BURN/MaterialList.vue';
import { useTileState } from '@src/features/XIT/BURN/tile-state';

const props = defineProps({
  canMinimize: Boolean,
  burn: {
    type: Object as PropType<PlanetBurn>,
    required: true,
  },
});

const expand = useTileState('expand');

const naturalId = computed(() => props.burn.naturalId);
const isMinimized = computed(() => props.canMinimize && !expand.value.includes(naturalId.value));

const onHeaderClick = () => {
  if (isMinimized.value) {
    expand.value = [...expand.value, naturalId.value];
  } else {
    expand.value = expand.value.filter(x => x !== naturalId.value);
  }
};
</script>

<template>
  <tbody>
    <PlanetHeader
      :has-minimize="canMinimize"
      :burn="burn"
      :minimized="isMinimized"
      :on-click="onHeaderClick" />
  </tbody>
  <tbody v-if="!isMinimized">
    <MaterialList :burn="burn" />
  </tbody>
</template>

<style module>
.collapse {
  visibility: collapse;
}
</style>
