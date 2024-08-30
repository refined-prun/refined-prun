<script setup lang="ts">
import { computed, PropType } from 'vue';
import DaysCell from '@src/XIT/BURN/DaysCell.vue';
import { settings } from '@src/store/settings';
import { materialsStore } from '@src/prun-api/data/materials';
import { fixed2 } from '@src/utils/format';

const props = defineProps({
  burn: {
    type: Object,
    required: true,
  },
  minimized: Boolean,
  onClick: {
    type: Function as PropType<() => void>,
    required: true,
  },
});

const days = computed(() => {
  let days = 1000;
  for (const key of Object.keys(props.burn.burn)) {
    const mat = props.burn.burn[key];
    if (!isNaN(mat.DailyAmount) && mat.DailyAmount < 0 && mat.DaysLeft < days) {
      days = mat.DaysLeft;
    }
  }
  return days;
});

const needWeight = computed(() => sumNeed(x => x.weight));
const needVolume = computed(() => sumNeed(x => x.volume));

function sumNeed(property: (x: PrunApi.Material) => number) {
  const resupply = settings.burn.resupply;
  let sum = 0;
  for (const key of Object.keys(props.burn.burn)) {
    const mat = materialsStore.getByTicker(key);
    if (!mat) {
      continue;
    }
    const { DailyAmount: production, DaysLeft: days } = props.burn.burn[key];
    if (isNaN(production) || production >= 0 || days > resupply) {
      continue;
    }
    const needed = (days - resupply) * production;
    sum += needed * property(mat);
  }
  return sum;
}
</script>

<template>
  <tr :class="$style.row">
    <td colspan="4" :class="$style.cell">
      <span :class="$style.minimize" @click="onClick">{{ minimized ? '+' : '-' }}</span>
      <span>{{ burn.planetName }}</span>
    </td>
    <!-- This <tr> is needed so both other <tr>s are the same color -->
    <td :style="{ display: 'none' }" />
    <td>
      <span>{{ fixed2(needWeight) }}t</span>
      <br />
      <span>{{ fixed2(needVolume) }}m³</span>
    </td>
    <DaysCell :days="days" />
  </tr>
</template>

<style module>
.row {
  border-bottom: 1px solid #2b485a;
}

.cell {
  font-weight: bold;
  font-size: 16px;
}

.minimize {
  display: inline-block;
  width: 26px;
  text-align: center;
  cursor: pointer;
}
</style>
