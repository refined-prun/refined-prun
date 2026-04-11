<script setup lang="ts">
import MaterialIcon from '@src/components/MaterialIcon.vue';
import { fixed2 } from '@src/utils/format';
import PrunButton from '@src/components/PrunButton.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { useTileState } from '@src/features/XIT/MATIO/tile-state';
import {
  formatFlowAmount,
  getPriceForPricing,
  matchesMode,
  MatioMaterialFlow,
  MatioPricing,
} from '@src/features/XIT/MATIO/utils';

const { alwaysVisible, flow, material, pricing } = defineProps<{
  alwaysVisible?: boolean;
  flow: MatioMaterialFlow;
  material: PrunApi.Material;
  pricing: MatioPricing;
}>();

const inAmount = computed(() => flow.input + flow.workforce);
const mode = useTileState('mode');

const isVisible = computed(() => alwaysVisible || matchesMode(flow, mode.value));

const changeText = computed(() => formatFlowAmount(flow.dailyAmount));
const inText = computed(() => formatFlowAmount(inAmount.value));
const outText = computed(() => formatFlowAmount(flow.output));
const valuePerDay = computed(() => {
  const price = getPriceForPricing(material.ticker, pricing);
  return price === undefined ? undefined : flow.dailyAmount * price;
});
const valueText = computed(() =>
  valuePerDay.value === undefined ? '--' : fixed2(valuePerDay.value),
);

const changeClass = computed(() => ({
  [C.ColoredValue.positive]: flow.dailyAmount > 0,
}));
const inClass = computed(() => ({
  [C.RadioItem.valueDisabled]: inAmount.value === 0,
}));
const outClass = computed(() => ({
  [C.RadioItem.valueDisabled]: flow.output === 0,
}));
const valueClass = computed(() => ({
  [C.ColoredValue.positive]: (valuePerDay.value ?? 0) > 0,
}));
</script>

<template>
  <tr v-if="isVisible">
    <td :class="$style.materialContainer">
      <MaterialIcon size="inline-table" :ticker="material.ticker" />
    </td>
    <td>
      <span :class="inClass">{{ inText }}</span>
    </td>
    <td>
      <span :class="outClass">{{ outText }}</span>
    </td>
    <td>
      <span :class="changeClass">{{ changeText }}</span>
    </td>
    <td>
      <span :class="valueClass">{{ valueText }}</span>
    </td>
    <td>
      <PrunButton dark inline @click="showBuffer(`CXM ${material.ticker}`)">CXM</PrunButton>
    </td>
  </tr>
</template>

<style module>
.materialContainer {
  width: 32px;
  padding: 0;
}
</style>
