<script setup lang="ts">
import Tooltip, { TooltipPosition } from '@src/components/Tooltip.vue';

const { error } = defineProps<{
  error?: boolean;
  label?: string;
  tooltip?: string;
  tooltipPosition?: TooltipPosition;
}>();

const errorClasses = computed(() => (error ? [C.FormComponent.containerError, C.forms.error] : []));
</script>

<template>
  <div
    :class="[C.FormComponent.containerActive, C.forms.active, C.forms.formComponent, errorClasses]">
    <label>
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
