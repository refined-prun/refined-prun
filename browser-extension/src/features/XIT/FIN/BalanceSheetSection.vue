<script setup lang="ts">
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { formatChange, formatCurrencyAmount } from './utils';
import { computed, PropType } from 'vue';
import { SectionData } from '@src/features/XIT/FIN/balance-section';
import { PartialBalanceSheet } from '@src/core/balance/balance-sheet';
import BalanceSheetRow from '@src/features/XIT/FIN/BalanceSheetRow.vue';

const props = defineProps({
  current: {
    type: Object as PropType<PartialBalanceSheet>,
    required: true,
  },
  last: {
    type: Object as PropType<PartialBalanceSheet | undefined>,
    default: undefined,
  },
  previous: {
    type: Object as PropType<PartialBalanceSheet | undefined>,
    default: undefined,
  },
  section: {
    type: Object as PropType<SectionData>,
    required: true,
  },
});

function calculate(
  sheet: PartialBalanceSheet | undefined,
  selector: (x: PartialBalanceSheet) => number | undefined,
) {
  return sheet !== undefined ? selector(sheet) : undefined;
}

function calculateChange(selector: (x: PartialBalanceSheet) => number | undefined) {
  const fromLast = calculate(props.last, selector);
  const fromPrevious = calculate(props.previous, selector);
  if (fromLast === undefined || fromPrevious === undefined || fromPrevious === 0) {
    return undefined;
  }
  return (fromLast - fromPrevious) / fromPrevious;
}

const totalClass = computed(() => {
  if (!props.section.coloredTotal) {
    return undefined;
  }
  const change = calculateChange(props.section.total);
  if (change === undefined) {
    return undefined;
  }

  return {
    [PrunCss.ColoredValue.positive]: change > 0,
    [PrunCss.ColoredValue.negative]: change < 0,
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
      :indent="0" />
    <tr :class="PrunCss.IncomeStatementPanel.totals">
      <td :class="PrunCss.IncomeStatementPanel.number">Total</td>
      <td>{{ formatCurrencyAmount(calculate(current, section.total)) }}</td>
      <td>{{ formatCurrencyAmount(calculate(last, section.total)) }}</td>
      <td>{{ formatCurrencyAmount(calculate(previous, section.total)) }}</td>
      <td :class="totalClass">{{ formatChange(calculateChange(section.total)) }}</td>
    </tr>
  </tbody>
</template>

<style scoped>
tbody tr > *:not(:first-child) {
  text-align: right;
}
</style>
