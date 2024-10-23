<script setup lang="ts">
import { computed, PropType } from 'vue';
import { MaterialBurn } from '@src/core/burn';
import MaterialIcon from '@src/components/MaterialIcon.vue';
import DaysCell from '@src/features/XIT/BURN/DaysCell.vue';
import { fixed0, fixed1, fixed2 } from '@src/utils/format';
import { useTileState } from '@src/features/XIT/BURN/tile-state';
import PrunButton from '@src/components/PrunButton.vue';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { userData } from '@src/store/user-data';

const props = defineProps({
  material: {
    type: Object as PropType<PrunApi.Material>,
    required: true,
  },
  burn: {
    type: Object as PropType<MaterialBurn>,
    required: true,
  },
});

const production = computed(() => props.burn.DailyAmount);
const invAmount = computed(() => props.burn.Inventory ?? 0);
const isInf = computed(() => production.value >= 0);
const days = computed(() => (isInf.value ? 1000 : props.burn.DaysLeft));

const isRed = computed(() => days.value <= userData.settings.burn.red);
const isYellow = computed(() => days.value <= userData.settings.burn.yellow);
const isGreen = computed(() => days.value > userData.settings.burn.yellow);

const red = useTileState('red');
const yellow = useTileState('yellow');
const green = useTileState('green');
const inf = useTileState('inf');

const isVisible = computed(() => {
  if (isInf.value && !inf.value) {
    return false;
  }
  return (
    (isRed.value && red.value) || (isYellow.value && yellow.value) || (isGreen.value && green.value)
  );
});

const changeText = computed(() => {
  const abs = Math.abs(production.value);
  const fixed = abs >= 1000 ? fixed0(abs) : abs >= 100 ? fixed1(abs) : fixed2(abs);
  return production.value > 0 ? '+' + fixed : fixed;
});

const changeClass = computed(() => ({
  [PrunCss.ColoredValue.positive]: production.value > 0,
}));

const needAmt = computed(() =>
  days.value > userData.settings.burn.resupply || production.value > 0
    ? 0
    : (days.value - userData.settings.burn.resupply) * production.value,
);
</script>

<template>
  <tr v-if="isVisible">
    <td :class="$style.materialContainer">
      <MaterialIcon size="inline-table" :ticker="material.ticker" />
    </td>
    <td>
      <span>{{ invAmount }}</span>
    </td>
    <td>
      <span :class="changeClass">{{ changeText }}</span>
    </td>
    <td>
      <span>{{ isNaN(needAmt) ? '0' : fixed0(needAmt) }}</span>
    </td>
    <DaysCell :days="days" />
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
