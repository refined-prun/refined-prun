<script setup lang="ts">
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
  [C.Button.btn]: true,
  [C.Button.inline]: props.inline,
  [C.Button.primary]: props.primary,
  [C.Button.primaryInline]: props.primary && props.inline,
  [C.Button.disabled]: props.disabled,
  [C.Button.disabledInline]: props.disabled && props.inline,
  [C.Button.neutral]: props.neutral,
  [C.Button.neutralInline]: props.neutral && props.inline,
  [C.Button.success]: props.success,
  [C.Button.successInline]: props.success && props.inline,
  [C.Button.danger]: props.danger,
  [C.Button.dangerInline]: props.danger && props.inline,
  [C.Button.dark]: props.dark,
  [C.Button.darkInline]: props.dark && props.inline,
}));
</script>

<template>
  <button :class="classes" type="button">
    <slot />
  </button>
</template>
