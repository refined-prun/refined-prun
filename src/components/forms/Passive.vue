<script setup lang="ts">
import Tooltip, { TooltipPosition } from '@src/components/Tooltip.vue';

defineProps<{
  label?: string;
  tooltip?: string;
  tooltipPosition?: TooltipPosition;
}>();
</script>

<template>
  <div :class="[C.FormComponent.containerPassive, C.forms.passive, C.forms.formComponent]">
    <label :class="[C.FormComponent.label, C.fonts.fontRegular, C.type.typeRegular]">
      <span>{{ label }}</span>
      <Tooltip v-if="tooltip" :position="tooltipPosition" :tooltip="tooltip" />
    </label>
    <div :class="[C.FormComponent.input, C.forms.input]">
      <div :class="[C.StaticInput.static, C.forms.static]">
        <slot />
      </div>
    </div>
  </div>
</template>
