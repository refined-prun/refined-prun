<script setup lang="ts">
const { numerator, denominator } = defineProps<{ numerator: number; denominator: number }>();

const burnClass = computed(() => ({
  [C.Workforces.daysMissing]: numerator < denominator,
  [C.Workforces.daysSupplied]: numerator >= denominator,
}));
</script>

<template>
  <td :style="{ position: 'relative' }">
    <div
      :style="{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }"
      :class="burnClass" />
    <span>{{ numerator.toString() + '/' + denominator.toString() }}</span>
  </td>
</template>
