<script setup lang="ts">
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

const props = defineProps({
  ticker: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: undefined,
  },
});

const amountClasses = [
  C.MaterialIcon.indicator,
  C.MaterialIcon.neutral,
  C.MaterialIcon.typeVerySmall,
];

function onClick(): void {
  showBuffer(`BUI ${props.ticker}`);
}
</script>

<template>
  <div :class="[C.BuildingIcon.container, $style.container]" :title="ticker" @click="onClick">
    <div :class="C.BuildingIcon.tickerContainer">
      <span :class="C.BuildingIcon.ticker">{{ ticker }}</span>
    </div>
    <div v-if="amount" :class="[C.MaterialIcon.indicatorContainer]">
      <div :class="amountClasses">{{ amount }}</div>
    </div>
  </div>
</template>

<style module>
.container {
  height: 34px;
  width: 34px;
  background: linear-gradient(135deg, rgb(52, 140, 160), rgb(77, 165, 185));
  color: rgb(179, 255, 255);
  font-size: 11px;
  cursor: pointer;
  position: relative;
}
</style>
