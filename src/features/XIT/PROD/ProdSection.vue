<script setup lang="ts">
import { PlanetBurn } from '@src/core/burn';

import MaterialList from '@src/features/XIT/BURN/MaterialList.vue';
import { useTileState } from '@src/features/XIT/BURN/tile-state';
import ProductionList from './ProductionList.vue';
import { PlanetProduction } from '@src/core/production';
import PlanetHeader from './PlanetHeader.vue';
const { production, canMinimize, headers } = defineProps<{
  production: PlanetProduction;
  canMinimize?: boolean;
  headers?: boolean;
}>();

const expand = useTileState('expand');

const naturalId = computed(() => production.naturalId);
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
      :production="production"
      :minimized="isMinimized"
      :on-click="onHeaderClick" />
  </tbody>
  <tbody v-if="!isMinimized">
    <ProductionList :production="production" :headers="headers" />
  </tbody>
</template>
