<script setup lang="ts">
import { PartialBalanceSheet } from '@src/core/balance/balance-sheet';
import { SectionData } from '@src/features/XIT/FINBS/balance-section';
import { formatAmount, formatChange } from '@src/features/XIT/FINBS/utils';
import RowExpandButton from '@src/features/XIT/FINBS/RowExpandButton.vue';
import Tooltip from '@src/components/Tooltip.vue';
import ChartButtonCell from '@src/features/XIT/FINBS/ChartButtonCell.vue';

const { last, previous, excluded } = defineProps<{
  current: PartialBalanceSheet;
  indent: number;
  last?: PartialBalanceSheet;
  previous?: PartialBalanceSheet;
  row: SectionData;
  excluded?: boolean;
}>();

const $style = useCssModule();

const excludedClass = computed(() => (excluded ? $style.excluded : null));

const expanded = ref(false);

function formatRowAmount(sheet: PartialBalanceSheet | undefined, row: SectionData) {
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
  <tr :class="excludedClass">
    <td>
      <template v-if="indent > 0">
        <RowExpandButton v-for="i in indent" :key="i" :class="$style.hidden" />
      </template>
      <RowExpandButton v-model="expanded" :class="!row.children ? $style.hidden : null" />
      <template v-if="row.less"> Less:</template>
      {{ row.name }}
      <Tooltip
        v-if="row.excluded"
        tooltip="This entry is not included in the Equity calculation.
         To include it, turn on the full equity mode in XIT SET FIN."
        :class="$style.tooltip" />
      <Tooltip v-else-if="row.tooltip" :tooltip="row.tooltip" :class="$style.tooltip" />
    </td>
    <td>{{ formatRowAmount(current, row) }}</td>
    <td>{{ formatRowAmount(last, row) }}</td>
    <td>{{ formatRowAmount(previous, row) }}</td>
    <td>{{ formatChange(calculateChange(row.value)) }}</td>
    <ChartButtonCell :chart-id="row.chartId" />
  </tr>
  <template v-if="row.children && expanded">
    <BalanceSheetRow
      v-for="child in row.children"
      :key="child.name"
      :current="current"
      :last="last"
      :previous="previous"
      :row="child"
      :indent="indent + 1"
      :excluded="excluded || child.excluded" />
  </template>
</template>

<style module>
.hidden {
  visibility: hidden;
}

.excluded {
  color: #888;
}

.tooltip {
  padding: 0;
}
</style>

<style scoped>
tbody tr > :not(:first-child) {
  text-align: right;
}
</style>
