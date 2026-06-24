<script setup lang="ts">
import { userData } from '@src/store/user-data';
import { fixed0, fixed01 } from '@src/utils/format';

const { days } = defineProps<{ days: number }>();

const formattedDays = computed(() => {
  if (days > 999) {
    return '∞';
  }
  if (days >= 10) {
    return fixed0(Math.floor(days));
  }
  return fixed01(days);
});

const burnClass = computed(() => {
  const flooredDays = Math.floor(days);
  return {
    [C.Workforces.daysMissing]: flooredDays <= userData.settings.burn.red,
    [C.Workforces.daysWarning]: flooredDays <= userData.settings.burn.yellow,
    [C.Workforces.daysSupplied]: flooredDays > userData.settings.burn.yellow,
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
