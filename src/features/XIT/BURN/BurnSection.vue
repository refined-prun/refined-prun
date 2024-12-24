<script setup lang="ts">
import { PlanetBurn } from '@src/core/burn';
import PlanetHeader from '@src/features/XIT/BURN/PlanetHeader.vue';
import MaterialList from '@src/features/XIT/BURN/MaterialList.vue';
import { useTileState } from '@src/features/XIT/BURN/tile-state';

const { burn, canMinimize } = defineProps<{ burn: PlanetBurn; canMinimize?: boolean }>();

const expand = useTileState('expand');

const naturalId = computed(() => burn.naturalId);
const isMinimized = computed(() => canMinimize && !expand.value.includes(naturalId.value));

const onHeaderClick = () => {
  if (!canMinimize) {
    return;
  }
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
