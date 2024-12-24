<script setup lang="ts">
import { userData } from '@src/store/user-data';

const { days } = defineProps<{ days: number }>();

const flooredDays = computed(() => Math.floor(days));
const burnClass = computed(() => ({
  [C.Workforces.daysMissing]: flooredDays.value <= userData.settings.burn.red,
  [C.Workforces.daysWarning]: flooredDays.value <= userData.settings.burn.yellow,
  [C.Workforces.daysSupplied]: flooredDays.value > userData.settings.burn.yellow,
}));
</script>

<template>
  <td :style="{ position: 'relative' }">
    <div
      :style="{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }"
      :class="burnClass" />
    <span>{{ flooredDays < 500 ? flooredDays : '∞' }}</span>
  </td>
</template>
