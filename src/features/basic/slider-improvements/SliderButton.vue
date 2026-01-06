<script setup lang="ts">
defineProps<{ onClick?: () => void; label: string; disabled?: boolean }>();
</script>

<template>
  <button
    :class="` ${disabled ? C.Button.disabledInline : C.Button.primaryInline} ${disabled ? C.Button.disabled : C.Button.primary} ${C.Button.inline} ${C.Button.btn} `"
    :disabled="disabled"
    @click="onClick">
    {{ label }}
  </button>
</template>
