<script setup lang="ts">
import ColoredIcon, { ColoredIconSize } from '@src/components/ColoredIcon.vue';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { getMaterialName } from '@src/infrastructure/prun-ui/i18n';
import { fixed0 } from '@src/utils/format';
import { materialCategoriesStore } from '@src/infrastructure/prun-api/data/material-categories';

const props = defineProps({
  ticker: {
    type: String,
    required: true,
  },
  size: {
    type: String as PropType<ColoredIconSize>,
    default: 'large',
  },
  warning: Boolean,
  amount: {
    type: Number,
    required: false,
    default: undefined,
  },
});

const $style = useCssModule();

const material = computed(() => materialsStore.getByTicker(props.ticker));
const category = computed(() => materialCategoriesStore.getById(material.value?.category));

const name = computed(() => getMaterialName(material.value) ?? 'Unknown');

const amountText = computed(() => {
  if (props.amount === undefined) {
    return undefined;
  }

  if (props.size === 'medium' && props.amount >= 100000) {
    return fixed0(Math.round(props.amount / 1000)) + 'k';
  }

  return fixed0(props.amount);
});

const indicatorClasses = [
  C.MaterialIcon.indicator,
  C.MaterialIcon.neutral,
  C.MaterialIcon.typeVerySmall,
  {
    [C.ColoredValue.negative]: props.warning,
    [$style.indicatorSmall]: props.size === 'medium',
  },
];

const onClick = () => showBuffer(`MAT ${props.ticker.toUpperCase()}`);
</script>

<template>
  <div :class="[C.MaterialIcon.container, $style.container]">
    <ColoredIcon
      :label="ticker"
      :category="category?.name"
      :title="name"
      :size="size"
      @click="onClick" />
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
