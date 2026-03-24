<script setup lang="ts">
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

type BuildingIconSize = 'large' | 'medium' | 'small' | 'inline' | 'inline-table';

const { size = 'large', ticker } = defineProps<{
  amount?: number;
  size?: BuildingIconSize;
  ticker: string;
}>();

const amountClasses = [
  C.MaterialIcon.indicator,
  C.MaterialIcon.neutral,
  C.MaterialIcon.typeVerySmall,
];

const $style = useCssModule();

const containerClass = computed(() => ({
  [C.BuildingIcon.container]: true,
  [$style.container]: true,
  [$style.large]: !size || size === 'large',
  [$style.medium]: size === 'medium',
  [$style.small]: size === 'small',
  [$style.inline]: size === 'inline',
  [$style.inlineTable]: size === 'inline-table',
}));

function onClick(): void {
  showBuffer(`BUI ${ticker}`);
}
</script>

<template>
  <div :class="containerClass" :title="ticker" @click="onClick">
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
  background: linear-gradient(135deg, rgb(52, 140, 160), rgb(77, 165, 185));
  color: rgb(179, 255, 255);
  cursor: pointer;
  position: relative;
}

.large {
  height: 48px;
  width: 48px;
  font-size: 16px;
}

.medium {
  height: 32px;
  width: 32px;
  font-size: 11px;
}

.small {
  height: 24px;
  width: 24px;
  font-size: 9px;
}

.inline {
  height: 14px;
  width: 32px;
  font-size: 11px;
}

.inlineTable {
  height: 18px;
  width: 32px;
  font-size: 11px;
}
</style>
