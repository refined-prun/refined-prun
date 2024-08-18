<script setup lang="ts">
import PrunCss from '@src/prun-ui/prun-css';
import { computed } from 'vue';

const toggled = defineModel<boolean>();

const buttonClass = [PrunCss.RadioItem.container, PrunCss.RadioItem.containerHorizontal];
const barClass = computed(() => [
  PrunCss.RadioItem.indicator,
  PrunCss.RadioItem.indicatorHorizontal,
  {
    [PrunCss.RadioItem.active]: toggled.value,
    [PrunCss.effects.shadowPrimary]: toggled.value,
  },
]);
const labelClass = [
  PrunCss.RadioItem.value,
  PrunCss.RadioItem.valueHorizontal,
  PrunCss.fonts.fontRegular,
  PrunCss.type.typeSmall,
];

const onClick = () => (toggled.value = !toggled.value);
</script>

<template>
  <div :class="buttonClass" @click="onClick">
    <div :class="barClass" />
    <div :class="labelClass"><slot /></div>
  </div>
</template>
