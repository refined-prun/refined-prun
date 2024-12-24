<script setup lang="ts">
const { label = 'CMD' } = defineProps<{ label?: string }>();
</script>

<template>
  <div :class="[C.FormComponent.containerCommand, C.forms.cmd, C.forms.formComponent]">
    <label :class="[C.FormComponent.label, C.fonts.fontRegular, C.type.typeRegular]">
      <span>{{ label }}</span>
    </label>
    <div :class="[C.FormComponent.input, C.forms.input]">
      <slot />
    </div>
  </div>
</template>
