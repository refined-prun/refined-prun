<script setup lang="ts">
import Tooltip from '@src/components/Tooltip.vue';

interface KeyFigure {
  name: string;
  value: string;
  tooltip?: string;
  hidden?: boolean;
}

const { figures } = defineProps<{ figures: KeyFigure[] }>();

const visibleFigures = computed(() => figures.filter(x => !x.hidden));

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
    <div v-for="figure in visibleFigures" :key="figure.name" :class="figureClasses">
      <span>{{ figure.value }}</span>
      <div :class="labelClasses">
        {{ figure.name }}
        <Tooltip
          v-if="figure.tooltip"
          :tooltip="figure.tooltip"
          position="bottom"
          :class="$style.tooltip" />
      </div>
    </div>
  </div>
</template>

<style module>
.tooltip {
  padding: 0;
}
</style>
