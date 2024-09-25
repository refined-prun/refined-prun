<script setup lang="ts">
import { computed, PropType } from 'vue';
import { PlanetBurn } from '@src/core/burn';
import MaterialIcon from '@src/components/MaterialIcon.vue';
import DaysCell from '@src/features/XIT/BURN/DaysCell.vue';
import { fixed0, fixed1, fixed2 } from '@src/utils/format';
import { getPrice } from '@src/infrastructure/fio/cx';
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
const production = computed(() => matBurn.value.DailyAmount);
const invAmount = computed(() => matBurn.value.Inventory ?? 0);
const isInf = computed(() => production.value >= 0);
const days = computed(() => (isInf.value ? 1000 : matBurn.value.DaysLeft));

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

const needWeight = computed(() =>
  needAmt.value && !isNaN(needAmt.value) ? needAmt.value * props.material.weight : 0,
);

const needVolume = computed(() =>
  needAmt.value && !isNaN(needAmt.value) ? needAmt.value * props.material.volume : 0,
);

const needCost = computed(() => {
  if (isNaN(needAmt.value)) {
    return undefined;
  }
  const price = getPrice(props.material.ticker);
  if (price === undefined) {
    return undefined;
  }
  return needAmt.value * price;
});

function formatPrice(price: number | undefined): string {
  return price !== undefined ? userData.settings.currency + fixed0(price) : '--';
}
</script>

<template>
  <tr :class="{ [$style.collapse]: !isVisible }">
    <td :class="$style.materialContainer">
      <MaterialIcon size="medium" :ticker="material.ticker" :amount="invAmount" />
    </td>
    <td>
      <span :class="changeClass">{{ changeText }}</span>
    </td>
    <td>
      <span>{{ isNaN(needAmt) ? '0' : fixed0(needAmt) }}</span>
    </td>
    <DaysCell :days="days" />
    <td>
      <span>{{ fixed2(needWeight) }}t</span>
      <br />
      <span>{{ fixed2(needVolume) }}m³</span>
    </td>
    <td>{{ formatPrice(needCost) }}</td>
    <td>
      <PrunButton dark inline @click="showBuffer(`CXM ${material.ticker}`)">CXM</PrunButton>
    </td>
  </tr>
</template>

<style module>
.collapse {
  visibility: collapse;
}

.materialContainer {
  width: 32px;
  padding: 0 0 2px;
}
</style>
