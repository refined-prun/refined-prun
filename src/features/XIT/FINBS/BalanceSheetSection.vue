<script setup lang="ts">
import { formatChange } from '@src/features/XIT/FINBS/utils';
import { SectionData } from '@src/features/XIT/FINBS/balance-section';
import { PartialBalanceSheet } from '@src/core/balance/balance-sheet';
import BalanceSheetRow from '@src/features/XIT/FINBS/BalanceSheetRow.vue';
import { formatCurrency } from '@src/utils/format';
import ChartButtonCell from '@src/features/XIT/FINBS/ChartButtonCell.vue';

const { current, last, previous, section } = defineProps<{
  current: PartialBalanceSheet;
  last?: PartialBalanceSheet;
  previous?: PartialBalanceSheet;
  section: SectionData;
}>();

function calculate(
  sheet: PartialBalanceSheet | undefined,
  selector: (x: PartialBalanceSheet) => number | undefined,
) {
  return sheet !== undefined ? selector(sheet) : undefined;
}

function calculateChange(selector: (x: PartialBalanceSheet) => number | undefined) {
  const fromLast = calculate(last, selector);
  const fromPrevious = calculate(previous, selector);
  if (fromLast === undefined || fromPrevious === undefined || fromPrevious === 0) {
    return undefined;
  }
  return (fromLast - fromPrevious) / fromPrevious;
}

const totalClass = computed(() => {
  if (!section.coloredChange) {
    return undefined;
  }
  const change = calculateChange(section.value);
  if (change === undefined) {
    return undefined;
  }

  return {
    [C.ColoredValue.positive]: change > 0,
    [C.ColoredValue.negative]: change < 0,
  };
});
</script>

<template>
  <tbody>
    <tr>
      <th colspan="5">{{ section.name }}</th>
    </tr>
    <BalanceSheetRow
      v-for="row in section.children"
      :key="row.name"
      :current="current"
      :last="last"
      :previous="previous"
      :row="row"
      :indent="0"
      :excluded="row.excluded" />
    <tr :class="C.IncomeStatementPanel.totals">
      <td :class="C.IncomeStatementPanel.number">Total</td>
      <td>{{ formatCurrency(calculate(current, section.value)) }}</td>
      <td>{{ formatCurrency(calculate(last, section.value)) }}</td>
      <td>{{ formatCurrency(calculate(previous, section.value)) }}</td>
      <td :class="totalClass">{{ formatChange(calculateChange(section.value)) }}</td>
      <ChartButtonCell :chart-id="section.chartId" />
    </tr>
  </tbody>
</template>

<style scoped>
tbody tr > :not(:first-child) {
  text-align: right;
}
</style>
