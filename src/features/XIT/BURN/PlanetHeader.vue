<script setup lang="ts">
import { computed, PropType } from 'vue';
import DaysCell from '@src/features/XIT/BURN/DaysCell.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import PrunButton from '@src/components/PrunButton.vue';
import { PlanetBurn } from '@src/core/burn';

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
</script>

<template>
  <tr :class="$style.row">
    <td colspan="4" :class="$style.cell" @click="onClick">
      <span v-if="hasMinimize" :class="$style.minimize">
        {{ minimized ? '+' : '-' }}
      </span>
      <span>{{ burn.planetName }}</span>
    </td>
    <DaysCell :days="days" />
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
  font-size: 12px;
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
