<script setup lang="ts">
import { computed, useCssModule } from 'vue';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { percent0 } from '@src/utils/format';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const $style = useCssModule();

const ship = computed(() => shipsStore.getById(props.id));

const condition = computed(() => Math.floor((ship.value?.condition ?? 1) * 100) / 100);

const labelClass = computed(() => {
  if (condition.value <= 0.8) {
    return PrunCss.ColoredValue.negative;
  }
  if (condition.value <= 0.85) {
    return $style.warning;
  }
  return PrunCss.ColoredValue.positive;
});
</script>

<template>
  <span v-if="ship" :class="labelClass">&nbsp;{{ percent0(condition) }}</span>
</template>

<style module>
.warning {
  color: #f7a700;
}
</style>
