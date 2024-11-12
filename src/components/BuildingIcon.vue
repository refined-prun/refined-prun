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
  PrunCss.MaterialIcon.indicator,
  PrunCss.MaterialIcon.neutral,
  PrunCss.MaterialIcon.typeVerySmall,
];

function onClick(): void {
  showBuffer(`BUI ${props.ticker}`);
}
</script>

<template>
  <div :class="[PrunCss.BuildingIcon.container, $style.container]" :title="ticker" @click="onClick">
    <div :class="PrunCss.BuildingIcon.tickerContainer">
      <span :class="PrunCss.BuildingIcon.ticker">{{ ticker }}</span>
    </div>
    <div v-if="amount" :class="[PrunCss.MaterialIcon.indicatorContainer]">
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
