<script setup lang="ts">
import PrunCss from '@src/prun-ui/prun-css';

interface KeyFigure {
  name: string;
  value: string;
}

defineProps({
  figures: {
    type: Array<KeyFigure>,
    required: true,
  },
});

const containerClasses = [PrunCss.FinanceOverviewPanel.data, PrunCss.figures.container];
const figureClasses = [
  PrunCss.FinanceOverviewPanel.info,
  PrunCss.figures.figure,
  PrunCss.type.typeLarge,
];
const labelClasses = [
  PrunCss.FinanceOverviewPanel.label,
  PrunCss.figures.label,
  PrunCss.type.typeRegular,
  PrunCss.type.typeSmall,
];
</script>

<template>
  <div :class="containerClasses">
    <div v-for="figure in figures" :key="figure.name" :class="figureClasses">
      <span>{{ figure.value }}</span>
      <div :class="labelClasses">{{ figure.name }}</div>
    </div>
  </div>
</template>
