<script setup lang="ts">
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
const classes = [
  PrunCss.FinanceOverviewPanel.header,
  PrunCss.ui.header2,
  PrunCss.fonts.fontRegular,
];
</script>

<template>
  <h2 :class="classes"><slot /></h2>
</template>
