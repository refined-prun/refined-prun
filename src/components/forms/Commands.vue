<script setup lang="ts">
const { label = 'CMD' } = defineProps<{ label?: string }>();
</script>

<template>
  <div :class="[C.FormComponent.containerCommand, C.forms.cmd, C.forms.formComponent]">
    <label>
      <span>{{ label }}</span>
    </label>
    <div :class="[C.FormComponent.input, C.forms.input]">
      <slot />
    </div>
  </div>
</template>
