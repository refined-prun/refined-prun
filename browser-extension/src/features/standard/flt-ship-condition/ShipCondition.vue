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

const labelClass = computed(() => {
  const condition = ship.value?.condition;
  if (condition === undefined) {
    return undefined;
  }
  if (condition <= 0.8) {
    return PrunCss.ColoredValue.negative;
  }
  if (condition <= 0.85) {
    return $style.warning;
  }
  return PrunCss.ColoredValue.positive;
});
</script>

<template>
  <span v-if="ship" :class="labelClass">&nbsp;{{ percent0(ship.condition) }}</span>
</template>

<style module>
.warning {
  color: #f7a700;
}
</style>
