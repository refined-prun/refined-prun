<script setup lang="ts">
import Tooltip, { TooltipPosition } from '@src/components/Tooltip.vue';

defineProps({
  label: {
    type: String,
    default: undefined,
  },
  tooltip: {
    type: String,
    default: undefined,
  },
  tooltipPosition: {
    type: String as PropType<TooltipPosition>,
    default: undefined,
  },
});
</script>

<template>
  <div :class="[C.FormComponent.containerActive, C.forms.active, C.forms.formComponent]">
    <label :class="[C.FormComponent.label, C.fonts.fontRegular, C.type.typeRegular]">
      <span>{{ label }}</span>
      <Tooltip v-if="tooltip" :position="tooltipPosition" :tooltip="tooltip" />
    </label>
    <div :class="[C.FormComponent.input, C.forms.input]">
      <div :class="[C.DynamicInput.dynamic, C.forms.dynamic]">
        <slot />
      </div>
    </div>
  </div>
</template>
