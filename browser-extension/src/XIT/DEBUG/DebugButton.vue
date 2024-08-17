<script setup lang="ts">
import PrunCss from '@src/prun-ui/prun-css';
</script>

<template>
  <button :class="[PrunCss.Button.btn, PrunCss.Button.primary, $style.button]">
    <slot />
  </button>
</template>

<style module>
.button {
  display: block;
  margin-left: 4px;
  margin-bottom: 4px;
}
</style>
