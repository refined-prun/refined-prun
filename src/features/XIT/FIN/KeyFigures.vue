<script setup lang="ts">
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

const containerClasses = [C.FinanceOverviewPanel.data, C.figures.container];
const figureClasses = [C.FinanceOverviewPanel.info, C.figures.figure, C.type.typeLarge];
const labelClasses = [
  C.FinanceOverviewPanel.label,
  C.figures.label,
  C.type.typeRegular,
  C.type.typeSmall,
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
