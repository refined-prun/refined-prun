<script setup lang="ts">
import { computed, PropType } from 'vue';
import DaysCell from '@src/XIT/BURN/DaysCell.vue';

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
</script>

<template>
  <tr :class="$style.row">
    <td
      colspan="5"
      :style="{ display: 'table-cell', backgroundColor: 'rgba(1, 1, 1, 0)' }"
      class="title">
      <div class="pb-burn-minimize" @click="onClick">{{ minimized ? '+' : '-' }}</div>
      <span>{{ burn.planetName }}</span>
    </td>
    <DaysCell :days="days" />
  </tr>
</template>

<style module>
.row {
  border-bottom: 1px solid #2b485a;
}
</style>
