<script setup lang="ts">
const classes = [C.FinanceOverviewPanel.header, C.ui.header2, C.fonts.fontRegular];
</script>

<template>
  <h2 :class="classes"><slot /></h2>
</template>
