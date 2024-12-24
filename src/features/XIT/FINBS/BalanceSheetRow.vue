<script setup lang="ts">
import { PartialBalanceSheet } from '@src/core/balance/balance-sheet';
import { RowData } from '@src/features/XIT/FINBS/balance-section';
import { formatAmount, formatChange } from '@src/features/XIT/FINBS/utils';
import RowExpandButton from '@src/features/XIT/FINBS/RowExpandButton.vue';
import Tooltip from '@src/components/Tooltip.vue';

const { last, previous } = defineProps<{
  current: PartialBalanceSheet;
  indent: number;
  last?: PartialBalanceSheet;
  previous?: PartialBalanceSheet;
  row: RowData;
}>();

const expanded = ref(false);

function formatRowAmount(sheet: PartialBalanceSheet | undefined, row: RowData) {
  const amount = calculate(sheet, row.value);
  if (amount === undefined) {
    return '--';
  }
  const formatted = formatAmount(amount);
  return row.less ? `(${formatted})` : formatted;
}

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
</script>

<template>
  <tr>
    <td>
      <template v-if="indent > 0">
        <RowExpandButton v-for="i in indent" :key="i" :class="$style.hidden" />
      </template>
      <RowExpandButton v-model="expanded" :class="!row.children ? $style.hidden : null" />
      <template v-if="row.less"> Less:</template>
      {{ row.name }}
      <Tooltip v-if="row.tooltip" :tooltip="row.tooltip" :class="$style.tooltip" />
    </td>
    <td>{{ formatRowAmount(current, row) }}</td>
    <td>{{ formatRowAmount(last, row) }}</td>
    <td>{{ formatRowAmount(previous, row) }}</td>
    <td>{{ formatChange(calculateChange(row.value)) }}</td>
  </tr>
  <template v-if="row.children && expanded">
    <BalanceSheetRow
      v-for="child in row.children"
      :key="child.name"
      :current="current"
      :last="last"
      :previous="previous"
      :row="child"
      :indent="indent + 1" />
  </template>
</template>

<style module>
.hidden {
  visibility: hidden;
}

.tooltip {
  padding: 0;
}
</style>

<style scoped>
tbody tr > *:not(:first-child) {
  text-align: right;
}
</style>
