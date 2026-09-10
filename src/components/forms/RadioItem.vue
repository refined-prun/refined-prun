<script setup lang="ts">
const model = defineModel<boolean>();

const { horizontal = false } = defineProps<{ horizontal?: boolean }>();

const buttonClass = [
  C.RadioItem.container,
  {
    [C.RadioItem.containerHorizontal]: horizontal,
  },
];

const barClass = computed(() => [
  C.RadioItem.indicator,
  {
    [C.RadioItem.indicatorHorizontal]: horizontal,
    [C.RadioItem.indicatorVertical]: !horizontal,
    [C.RadioItem.active]: model.value,
    [C.effects.shadowPrimary]: model.value,
  },
]);

const labelClass = [
  C.RadioItem.value,
  C.fonts.fontRegular,
  C.type.typeSmall,
  {
    [C.RadioItem.valueHorizontal]: horizontal,
  },
];

function onClick() {
  model.value = !model.value;
}
</script>

<template>
  <div :class="buttonClass" @click="onClick">
    <div :class="barClass" />
    <div :class="labelClass">
      <slot />
    </div>
  </div>
</template>
