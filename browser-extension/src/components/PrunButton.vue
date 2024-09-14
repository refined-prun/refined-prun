<script setup lang="ts">
import { computed } from 'vue';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';

const props = defineProps({
  inline: Boolean,
  primary: Boolean,
  disabled: Boolean,
  neutral: Boolean,
  success: Boolean,
  danger: Boolean,
  dark: Boolean,
});

const classes = computed(() => ({
  [PrunCss.Button.btn]: true,
  [PrunCss.Button.inline]: props.inline,
  [PrunCss.Button.primary]: props.primary,
  [PrunCss.Button.primaryInline]: props.primary && props.inline,
  [PrunCss.Button.disabled]: props.disabled,
  [PrunCss.Button.disabledInline]: props.disabled && props.inline,
  [PrunCss.Button.neutral]: props.neutral,
  [PrunCss.Button.neutralInline]: props.neutral && props.inline,
  [PrunCss.Button.success]: props.success,
  [PrunCss.Button.successInline]: props.success && props.inline,
  [PrunCss.Button.danger]: props.danger,
  [PrunCss.Button.dangerInline]: props.danger && props.inline,
  [PrunCss.Button.dark]: props.dark,
  [PrunCss.Button.darkInline]: props.dark && props.inline,
}));
</script>

<template>
  <button :class="classes" type="button">
    <slot />
  </button>
</template>
