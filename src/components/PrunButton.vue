<script setup lang="ts">
const { danger, dark, disabled, inline, neutral, primary, success } = defineProps<{
  danger?: boolean;
  dark?: boolean;
  disabled?: boolean;
  inline?: boolean;
  neutral?: boolean;
  primary?: boolean;
  success?: boolean;
}>();

const classes = computed(() => ({
  [C.Button.btn]: true,
  [C.Button.inline]: inline,
  [C.Button.primary]: primary,
  [C.Button.primaryInline]: primary && inline,
  [C.Button.disabled]: disabled,
  [C.Button.disabledInline]: disabled && inline,
  [C.Button.neutral]: neutral,
  [C.Button.neutralInline]: neutral && inline,
  [C.Button.success]: success,
  [C.Button.successInline]: success && inline,
  [C.Button.danger]: danger,
  [C.Button.dangerInline]: danger && inline,
  [C.Button.dark]: dark,
  [C.Button.darkInline]: dark && inline,
}));
</script>

<template>
  <button :class="classes" type="button" :disabled="disabled">
    <slot />
  </button>
</template>
