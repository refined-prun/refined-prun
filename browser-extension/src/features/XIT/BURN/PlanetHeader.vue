<script setup lang="ts">
import { computed, PropType } from 'vue';
import DaysCell from '@src/features/XIT/BURN/DaysCell.vue';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { fixed0, fixed2 } from '@src/utils/format';
import { getPrice } from '@src/infrastructure/fio/cx';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import PrunButton from '@src/components/PrunButton.vue';
import { PlanetBurn } from '@src/core/burn';
import { userData } from '@src/store/user-data';

const props = defineProps({
  burn: {
    type: Object as PropType<PlanetBurn>,
    required: true,
  },
  hasMinimize: Boolean,
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
const needCost = computed(() => sumNeed(x => getPrice(x.ticker)));

function sumNeed(property: (x: PrunApi.Material) => number) {
  const resupply = userData.settings.burn.resupply;
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

function formatPrice(price: number): string {
  return userData.settings.currency + fixed0(price);
}
</script>

<template>
  <tr :class="$style.row">
    <td colspan="3" :class="$style.cell" @click="onClick">
      <span v-if="hasMinimize" :class="$style.minimize">
        {{ minimized ? '+' : '-' }}
      </span>
      <span>{{ burn.planetName }}</span>
    </td>
    <DaysCell :days="days" />
    <td>
      <span>{{ fixed2(needWeight) }}t</span>
      <br />
      <span>{{ fixed2(needVolume) }}m³</span>
    </td>
    <td>{{ formatPrice(needCost) }}</td>
    <td>
      <div :class="$style.buttons">
        <PrunButton dark inline @click="showBuffer(`BS ${burn.naturalId}`)">BS</PrunButton>
        <PrunButton dark inline @click="showBuffer(`INV ${burn.storeId}`)">INV</PrunButton>
      </div>
    </td>
  </tr>
</template>

<style module>
.row {
  border-bottom: 1px solid #2b485a;
}

.cell {
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}

.minimize {
  display: inline-block;
  width: 26px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 0.25rem;
}
</style>
