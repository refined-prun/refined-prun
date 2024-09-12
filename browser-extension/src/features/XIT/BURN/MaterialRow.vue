<script setup lang="ts">
import { settings } from '@src/store/settings';
import { computed, PropType } from 'vue';
import { PlanetBurn } from '@src/core/burn';
import MaterialIcon from '@src/components/MaterialIcon.vue';
import DaysCell from '@src/features/XIT/BURN/DaysCell.vue';
import { showBuffer } from '@src/util';
import { fixed0, fixed1, fixed2 } from '@src/utils/format';
import { getPrice } from '@src/infrastructure/fio/cx';
import { useTileState } from '@src/features/XIT/BURN/tile-state';
import PrunButton from '@src/components/PrunButton.vue';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';

const props = defineProps({
  material: {
    type: Object as PropType<PrunApi.Material>,
    required: true,
  },
  isMultiplanet: {
    type: Boolean,
    required: true,
  },
  burn: {
    type: Object as PropType<PlanetBurn>,
    required: true,
  },
});

const matBurn = computed(() => props.burn.burn[props.material.ticker]);
const days = computed(() => matBurn.value.DaysLeft);
const production = computed(() => matBurn.value.DailyAmount);
const invAmount = computed(() => matBurn.value.Inventory ?? 0);

const isRed = computed(() => days.value <= settings.burn.red);
const isYellow = computed(() => days.value <= settings.burn.yellow);
const isGreen = computed(() => days.value > settings.burn.yellow);
const isInf = computed(() => production.value >= 0);

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

const materialColumnStyle = computed(() => ({
  width: '32px',
  paddingRight: '0px',
  paddingLeft: props.isMultiplanet ? '32px' : '10px',
}));

const changeText = computed(() => {
  const abs = Math.abs(production.value);
  const fixed = abs < 1 ? fixed2(abs) : fixed1(abs);
  return production.value > 0 ? '+' + fixed : fixed;
});

const changeClass = computed(() => ({
  [PrunCss.ColoredValue.positive]: production.value > 0,
}));

const needAmt = computed(() =>
  days.value > settings.burn.resupply || production.value > 0
    ? 0
    : (days.value - settings.burn.resupply) * production.value,
);

const needWeight = computed(() =>
  needAmt.value && !isNaN(needAmt.value) ? needAmt.value * props.material.weight : 0,
);

const needVolume = computed(() =>
  needAmt.value && !isNaN(needAmt.value) ? needAmt.value * props.material.volume : 0,
);

const needCost = computed(() =>
  needAmt.value && !isNaN(needAmt.value) ? needAmt.value * getPrice(props.material.ticker) : 0,
);

function formatPrice(price: number): string {
  return settings.fin.currency + fixed0(price);
}
</script>

<template>
  <tr :class="{ [$style.collapse]: !isVisible }">
    <td :style="materialColumnStyle">
      <MaterialIcon size="medium" :ticker="material.ticker" :amount="invAmount" />
    </td>
    <td>
      <span :class="changeClass">{{ changeText }}</span>
    </td>
    <td>
      <span>{{ isNaN(needAmt) ? '0' : fixed0(needAmt) }}</span>
    </td>
    <td>
      <PrunButton dark @click="showBuffer(`CXM ${material.ticker}`)">CXM</PrunButton>
    </td>
    <td>
      <span>{{ fixed2(needWeight) }}t</span>
      <br />
      <span>{{ fixed2(needVolume) }}m³</span>
    </td>
    <td>{{ formatPrice(needCost) }}</td>
    <DaysCell :days="days" />
  </tr>
</template>

<style module>
.collapse {
  visibility: collapse;
}
</style>
