<script setup lang="ts">
const toggled = defineModel<boolean>();

const buttonClass = [C.RadioItem.container, C.RadioItem.containerHorizontal];
const barClass = computed(() => [
  C.RadioItem.indicator,
  C.RadioItem.indicatorHorizontal,
  {
    [C.RadioItem.active]: toggled.value,
    [C.effects.shadowPrimary]: toggled.value,
  },
]);
const labelClass = [
  C.RadioItem.value,
  C.RadioItem.valueHorizontal,
  C.fonts.fontRegular,
  C.type.typeSmall,
];

const onClick = () => (toggled.value = !toggled.value);
</script>

<template>
  <div :class="buttonClass" @click="onClick">
    <div :class="barClass" />
    <div :class="labelClass"><slot /></div>
  </div>
</template>
