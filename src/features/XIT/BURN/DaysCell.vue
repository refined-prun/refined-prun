<script setup lang="ts">
import { burnDaysClass, formatBurnDays } from '@src/features/XIT/BURN/utils';

const { days } = defineProps<{ days: number }>();

const formattedDays = computed(() => formatBurnDays(days));

const burnClass = computed(() => burnDaysClass(days));
</script>

<template>
  <td :style="{ position: 'relative' }">
    <div
      :style="{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }"
      :class="burnClass" />
    <span>{{ formattedDays }}</span>
  </td>
</template>
