<script setup lang="ts">
import { MaterialBurn } from '@src/core/burn';
import MaterialIcon from '@src/components/MaterialIcon.vue';
import DaysCell from '@src/features/XIT/BURN/DaysCell.vue';
import { fixed0, fixed1, fixed2 } from '@src/utils/format';
import { useTileState } from '@src/features/XIT/BURN/tile-state';
import PrunButton from '@src/components/PrunButton.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { userData } from '@src/store/user-data';

const { alwaysVisible, burn, material } = defineProps<{
  alwaysVisible?: boolean;
  burn: MaterialBurn;
  material: PrunApi.Material;
}>();

const production = computed(() => burn.dailyAmount);
const invAmount = computed(() => burn.inventory ?? 0);
const isInf = computed(() => production.value >= 0);
const days = computed(() => (isInf.value ? 1000 : burn.daysLeft));

const isRed = computed(() => days.value <= userData.settings.burn.red);
const isYellow = computed(() => days.value <= userData.settings.burn.yellow);
const isGreen = computed(() => days.value > userData.settings.burn.yellow);

const red = useTileState('red');
const yellow = useTileState('yellow');
const green = useTileState('green');
const inf = useTileState('inf');
const io = useTileState('io');

const isVisible = computed(() => {
  if (alwaysVisible) {
    return true;
  }
  if (isInf.value) {
    return inf.value;
  }
  return (
    (isRed.value && red.value) || (isYellow.value && yellow.value) || (isGreen.value && green.value)
  );
});

function formatAmount(value: number) {
  const abs = Math.abs(value);
  return abs >= 1000 ? fixed0(abs) : abs >= 100 ? fixed1(abs) : fixed2(abs);
}

const changeText = computed(() => {
  if (production.value === 0) {
    return 0;
  }
  const fixed = formatAmount(production.value);
  return production.value > 0 ? '+' + fixed : '-' + fixed;
});

const changeClass = computed(() => ({
  [C.ColoredValue.positive]: production.value > 0,
}));

const inAmount = computed(() => burn.input + burn.workforce);
const outAmount = computed(() => burn.output);

const inText = computed(() => (inAmount.value === 0 ? 0 : '-' + formatAmount(inAmount.value)));
const outText = computed(() => (outAmount.value === 0 ? 0 : '+' + formatAmount(outAmount.value)));

const outClass = computed(() => ({
  [C.ColoredValue.positive]: outAmount.value > 0,
}));

const needAmt = computed(() => {
  const resupply = userData.settings.burn.resupply;
  if (days.value > resupply || production.value > 0) {
    return 0;
  }
  let need = Math.ceil((days.value - resupply) * production.value);
  // This check is needed to prevent a "-0" value that can happen
  // in situations like: 0 * -0.25 => -0.
  need = need === 0 ? 0 : need;
  return need;
});
</script>

<template>
  <tr v-if="isVisible">
    <td :class="$style.materialContainer">
      <MaterialIcon size="inline-table" :ticker="material.ticker" />
    </td>
    <td>
      <span>{{ fixed0(invAmount) }}</span>
    </td>
    <template v-if="io">
      <td>
        <span>{{ inText }}</span>
      </td>
      <td>
        <span :class="outClass">{{ outText }}</span>
      </td>
      <td>
        <span :class="changeClass">{{ changeText }}</span>
      </td>
    </template>
    <td v-else>
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
