<script setup lang="ts">
const { numerator, denominator } = defineProps<{ numerator: number; denominator: number }>();

const burnClass = computed(() => ({
  [C.Workforces.daysMissing]: numerator < denominator,
  [C.Workforces.daysSupplied]: numerator >= denominator,
}));
</script>

<template>
  <td :class="$style.cell">
    <div :class="[burnClass, $style.overlay]" />
    <span>{{ numerator }}/{{ denominator }}</span>
  </td>
</template>

<style module>
.cell {
  position: relative;
}

.overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
