<script setup lang="ts">
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { percent0 } from '@src/utils/format';
import coloredValue from '@src/infrastructure/prun-ui/colored-value.module.css';

const { id } = defineProps<{ id?: string | null }>();

const ship = computed(() => shipsStore.getById(id));

const condition = computed(() => Math.floor((ship.value?.condition ?? 1) * 100) / 100);

const labelClass = computed(() => {
  if (condition.value <= 0.8) {
    return C.ColoredValue.negative;
  }
  if (condition.value <= 0.85) {
    return coloredValue.warning;
  }
  return C.ColoredValue.positive;
});
</script>

<template>
  <span v-if="ship" :class="labelClass">&nbsp;{{ percent0(condition) }}</span>
</template>
