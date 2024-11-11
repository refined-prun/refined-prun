<script setup lang="ts">
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { PropType } from 'vue';
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
  <div
    :class="[
      PrunCss.FormComponent.containerActive,
      PrunCss.forms.active,
      PrunCss.forms.formComponent,
    ]">
    <label
      :class="[PrunCss.FormComponent.label, PrunCss.fonts.fontRegular, PrunCss.type.typeRegular]">
      <span>{{ label }}</span>
      <Tooltip v-if="tooltip" :position="tooltipPosition" :tooltip="tooltip" />
    </label>
    <div :class="[PrunCss.FormComponent.input, PrunCss.forms.input]">
      <div :class="[PrunCss.DynamicInput.dynamic, PrunCss.forms.dynamic]">
        <slot />
      </div>
    </div>
  </div>
</template>
