<script setup lang="ts">
import ColoredIcon, { ColoredIconSize } from '@src/components/ColoredIcon.vue';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { getMaterialName } from '@src/infrastructure/prun-ui/i18n';
import { fixed0 } from '@src/utils/format';

const {
  amount,
  size = 'large',
  ticker,
  warning,
} = defineProps<{
  amount?: number;
  size?: ColoredIconSize;
  ticker: string;
  warning?: boolean;
}>();

const $style = useCssModule();

const material = computed(() => materialsStore.getByTicker(ticker));

const name = computed(() => getMaterialName(material.value) ?? 'Unknown');

const amountText = computed(() => {
  if (amount === undefined) {
    return undefined;
  }

  if (size === 'medium' && amount >= 100000) {
    return fixed0(Math.round(amount / 1000)) + 'k';
  }

  return fixed0(amount);
});

const indicatorClasses = [
  C.MaterialIcon.indicator,
  C.MaterialIcon.neutral,
  C.MaterialIcon.typeVerySmall,
  {
    [C.ColoredValue.negative]: warning,
    [$style.indicatorSmall]: size === 'medium',
  },
];

const onClick = () => showBuffer(`MAT ${ticker.toUpperCase()}`);
</script>

<template>
  <div :class="[C.MaterialIcon.container, $style.container]">
    <ColoredIcon :label="ticker" :title="name" :size="size" @click="onClick" />
    <div
      v-if="amountText !== undefined"
      :class="C.MaterialIcon.indicatorContainer"
      @click="onClick">
      <div :class="indicatorClasses">{{ amountText }}</div>
    </div>
  </div>
</template>

<style module>
.container {
  cursor: pointer;
  width: fit-content;
  height: fit-content;
}

.indicatorSmall {
  padding: 2px 2px 1px 3px;
}
</style>
