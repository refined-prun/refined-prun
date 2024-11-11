<script setup lang="ts">
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
</script>

<template>
  <div :class="[PrunCss.SectionHeader.container, PrunCss.fonts.fontRegular]"><slot /></div>
</template>
