<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: 'CMD',
  },
});
</script>

<template>
  <div
    :class="[
      PrunCss.FormComponent.containerCommand,
      PrunCss.forms.cmd,
      PrunCss.forms.formComponent,
    ]">
    <label
      :class="[PrunCss.FormComponent.label, PrunCss.fonts.fontRegular, PrunCss.type.typeRegular]">
      <span>{{ label }}</span>
    </label>
    <div :class="[PrunCss.FormComponent.input, PrunCss.forms.input]">
      <slot />
    </div>
  </div>
</template>
