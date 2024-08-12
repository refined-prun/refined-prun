<script setup lang="ts">
import PrunCss from '@src/prun-ui/prun-css';
import { computed, PropType } from 'vue';

const props = defineProps({
  toggled: Boolean,
  text: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  onClick: {
    type: Function as PropType<() => void>,
    required: true,
  },
});

const buttonClass = [PrunCss.RadioItem.container, PrunCss.RadioItem.containerHorizontal];
const barUntoggledClass = [PrunCss.RadioItem.indicator, PrunCss.RadioItem.indicatorHorizontal];
const barToggledClass = [
  PrunCss.RadioItem.indicator,
  PrunCss.RadioItem.indicatorHorizontal,
  PrunCss.RadioItem.active,
  PrunCss.effects.shadowPrimary,
];
const barClass = computed(() => (props.toggled ? barToggledClass : barUntoggledClass));
const barStyle = computed(() => ({
  width: `${props.width}px`,
  maxWidth: `${props.width}px`,
  height: '2px',
}));
const textBoxClass = [
  PrunCss.RadioItem.value,
  PrunCss.RadioItem.valueHorizontal,
  PrunCss.fonts.fontRegular,
  PrunCss.type.typeSmall,
];
</script>

<template>
  <div :class="buttonClass" @click="onClick">
    <div :class="barClass" :style="barStyle" />
    <div :class="textBoxClass">{{ text }}</div>
  </div>
</template>
