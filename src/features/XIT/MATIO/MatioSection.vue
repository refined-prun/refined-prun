<script setup lang="ts">
import { PlanetBurn } from '@src/core/burn';
import PlanetHeader from '@src/features/XIT/MATIO/PlanetHeader.vue';
import MaterialList from '@src/features/XIT/MATIO/MaterialList.vue';
import { useTileState } from '@src/features/XIT/MATIO/tile-state';
import { normalizePricing } from '@src/features/XIT/MATIO/utils';

const { section, canMinimize } = defineProps<{ section: PlanetBurn; canMinimize?: boolean }>();

const expand = useTileState('expand');
const pricingByPlanet = useTileState('pricingByPlanet');

const naturalId = computed(() => section.naturalId);
const pricingKey = computed(() => section.naturalId || 'overall');
const isMinimized = computed(() => canMinimize && !expand.value.includes(naturalId.value));
const pricing = computed({
  get: () => normalizePricing(pricingByPlanet.value[pricingKey.value]),
  set: value => {
    pricingByPlanet.value = {
      ...pricingByPlanet.value,
      [pricingKey.value]: normalizePricing(value),
    };
  },
});

const onHeaderClick = () => {
  if (!canMinimize) {
    return;
  }
  expand.value = isMinimized.value
    ? [...expand.value, naturalId.value]
    : expand.value.filter(x => x !== naturalId.value);
};
</script>

<template>
  <tbody>
    <PlanetHeader
      v-model:pricing="pricing"
      :has-minimize="canMinimize"
      :section="section"
      :minimized="isMinimized"
      :on-click="onHeaderClick" />
  </tbody>
  <tbody v-if="!isMinimized">
    <MaterialList :section="section" :pricing="pricing" />
  </tbody>
</template>
