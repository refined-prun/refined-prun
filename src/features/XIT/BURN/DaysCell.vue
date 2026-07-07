<script setup lang="ts">
import { fixed0, fixed01 } from '@src/utils/format';
import { displayedDays, getBurnThresholds } from '@src/features/XIT/BURN/utils';

const { days } = defineProps<{ days: number }>();

const formattedDays = computed(() => {
  if (days > 999) {
    return '∞';
  }
  const shownDays = displayedDays(days);
  return days >= 10 ? fixed0(shownDays) : fixed01(shownDays);
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
