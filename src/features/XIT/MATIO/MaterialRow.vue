<script setup lang="ts">
import MaterialIcon from '@src/components/MaterialIcon.vue';
import { fixed0, fixed1, fixed2 } from '@src/utils/format';
import PrunButton from '@src/components/PrunButton.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { useTileState } from '@src/features/XIT/MATIO/tile-state';
import { matchesMode, MatioRowBurn } from '@src/features/XIT/MATIO/utils';

const { alwaysVisible, burn, material } = defineProps<{
  alwaysVisible?: boolean;
  burn: MatioRowBurn;
  material: PrunApi.Material;
}>();

const production = computed(() => burn.dailyAmount);
const inAmount = computed(() => burn.input + burn.workforce);
const outAmount = computed(() => burn.output);
const invAmount = computed(() => burn.inventory ?? 0);
const mode = useTileState('mode');

const isVisible = computed(() => {
  if (alwaysVisible) {
    return true;
  }
  return matchesMode(burn, mode.value);
});

function formatAmount(value: number, withSign = false) {
  if (value === 0) {
    return 0;
  }
  const abs = Math.abs(value);
  const fixed = abs >= 1000 ? fixed0(abs) : abs >= 100 ? fixed1(abs) : fixed2(abs);
  if (!withSign) {
    return fixed;
  }
  return value > 0 ? '+' + fixed : '-' + fixed;
}

const changeText = computed(() => formatAmount(production.value, true));
const inText = computed(() => formatAmount(inAmount.value));
const outText = computed(() => formatAmount(outAmount.value));

const changeClass = computed(() => ({
  [C.ColoredValue.positive]: production.value > 0,
}));
</script>

<template>
  <tr v-if="isVisible">
    <td :class="$style.materialContainer">
      <MaterialIcon size="inline-table" :ticker="material.ticker" />
    </td>
    <td>
      <span>{{ fixed0(invAmount) }}</span>
    </td>
    <td>
      <span>{{ inText }}</span>
    </td>
    <td>
      <span>{{ outText }}</span>
    </td>
    <td>
      <span :class="changeClass">{{ changeText }}</span>
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
