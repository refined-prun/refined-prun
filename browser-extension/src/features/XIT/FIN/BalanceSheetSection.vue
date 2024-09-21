<script setup lang="ts">
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { formatAmount, formatChange } from './utils';
import { computed, PropType } from 'vue';
import { SectionData } from '@src/features/XIT/FIN/balance-section';
import { PartialBalanceSheet } from '@src/core/balance/balance-sheet';

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

function calculateChange(selector: (x: PartialBalanceSheet) => number | undefined) {
  if (!props.last || !props.previous) {
    return undefined;
  }
  const fromLast = selector(props.last);
  const fromPrevious = selector(props.previous);
  if (fromLast === undefined || fromPrevious === undefined || fromPrevious === 0) {
    return undefined;
  }
  return (fromLast - fromPrevious) / fromPrevious;
}

const totalClass = computed(() => {
  if (!props.section.important) {
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
    <tr v-for="row in section.rows" :key="row[0]">
      <td>{{ row[0] }}</td>
      <td>{{ formatAmount(row[1](current)) }}</td>
      <td>{{ formatAmount(row[1](last)) }}</td>
      <td>{{ formatAmount(row[1](previous)) }}</td>
      <td>{{ formatChange(calculateChange(row[1])) }}</td>
    </tr>
    <tr :class="PrunCss.IncomeStatementPanel.totals">
      <td :class="PrunCss.IncomeStatementPanel.number">Total</td>
      <td>{{ formatAmount(section.total(current)) }}</td>
      <td>{{ formatAmount(section.total(last)) }}</td>
      <td>{{ formatAmount(section.total(previous)) }}</td>
      <td :class="totalClass">{{ formatChange(calculateChange(section.total)) }}</td>
    </tr>
  </tbody>
</template>

<style scoped>
tbody tr > *:not(:first-child) {
  text-align: right;
}
</style>
