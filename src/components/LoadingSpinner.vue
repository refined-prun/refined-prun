<script setup lang="ts">
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
</script>

<template>
  <div :class="PrunCss.Loading.loader" title="Loading…" />
</template>
