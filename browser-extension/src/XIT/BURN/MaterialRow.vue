<script setup lang="ts">
import { getMaterialNameByTicker } from '@src/prun-ui/material-names';
import { settings } from '@src/store/settings';
import { computed, PropType } from 'vue';
import { PlanetBurn } from '@src/burn';
import MaterialIcon from '@src/components/MaterialIcon.vue';
import DaysCell from '@src/XIT/BURN/DaysCell.vue';

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
  dispSettings: {
    type: Object,
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

const isVisible = computed(() => {
  if (isInf.value && !props.dispSettings.inf) {
    return false;
  }
  return (
    (isRed.value && props.dispSettings.red) ||
    (isYellow.value && props.dispSettings.yellow) ||
    (isGreen.value && props.dispSettings.green)
  );
});

const materialColumnStyle = computed(() => ({
  width: '32px',
  paddingRight: '0px',
  paddingLeft: props.isMultiplanet ? '32px' : '0px',
}));

const consText = computed(() =>
  Math.abs(production.value) < 1 ? production.value.toFixed(2) : production.value.toFixed(1),
);

const needAmt = computed(() =>
  days.value > settings.burn.resupply || production.value > 0
    ? 0
    : (days.value - settings.burn.resupply) * production.value,
);
</script>

<template>
  <tr v-if="isVisible">
    <td :style="materialColumnStyle">
      <MaterialIcon small :ticker="material.ticker" />
    </td>
    <td>
      <span :style="{ fontWeight: 'bold' }">{{ getMaterialNameByTicker(material.ticker) }}</span>
    </td>
    <td>
      <span>{{ consText }} / Day</span>
    </td>
    <td>
      <span>{{ invAmount }}</span>
    </td>
    <td>
      <span>{{ isNaN(needAmt) ? '0' : needAmt.toFixed(0) }}</span>
    </td>
    <DaysCell :days="days" />
  </tr>
</template>
