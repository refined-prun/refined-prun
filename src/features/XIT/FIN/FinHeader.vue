<script setup lang="ts">
const classes = [
  PrunCss.FinanceOverviewPanel.header,
  PrunCss.ui.header2,
  PrunCss.fonts.fontRegular,
];
</script>

<template>
  <h2 :class="classes"><slot /></h2>
</template>
