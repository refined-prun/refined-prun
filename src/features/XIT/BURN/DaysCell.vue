<script setup lang="ts">
import { getBurnThresholds } from '@src/features/XIT/BURN/utils';
import { trunc0, trunc01 } from '@src/utils/format';

const { days } = defineProps<{ days: number }>();

const formattedDays = computed(() => {
  if (days > 999) {
    return '∞';
  }
  if (days >= 10) {
    return trunc0(days);
  }
  return trunc01(days);
});

const burnClass = computed(() => {
  const { isRed, isYellow, isGreen } = getBurnThresholds(days);
  return {
    [C.Workforces.daysMissing]: isRed,
    [C.Workforces.daysWarning]: isYellow,
    [C.Workforces.daysSupplied]: isGreen,
  };
});
</script>

<template>
  <td :style="{ position: 'relative' }">
    <div
      :style="{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }"
      :class="burnClass" />
    <span>{{ formattedDays }}</span>
  </td>
</template>
