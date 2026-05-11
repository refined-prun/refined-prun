<script setup lang="ts">
import { fixed0, ddmmyyyy } from '@src/utils/format';

const { totals } = defineProps<{
  date: number;
  hideTotals?: boolean;
  totals: { [currency: string]: { purchases: number; sales: number } };
}>();

const totalsLabels = computed(() => {
  return Object.keys(totals)
    .sort()
    .map(x => ({
      currency: x,
      purchases: totals[x].purchases,
      sales: totals[x].sales,
      total: totals[x].sales - totals[x].purchases,
    }));
});
</script>

<template>
  <tr>
    <td colspan="2" :class="$style.column">
      <span>{{ ddmmyyyy(date) }}</span>
    </td>
    <!-- This <tr> is needed so both other <tr>s are the same color -->
    <td :style="{ display: 'none' }" />
    <td colspan="5" :class="$style.column">
      <div v-if="!hideTotals" :class="$style.totals">
        <div :class="$style.totalsColumn">
          <span v-for="total in totalsLabels" :key="total.currency">{{ fixed0(total.sales) }}</span>
        </div>
        <div :class="[$style.totalsColumn, $style.totalsSeparator]">
          <span v-for="i in totalsLabels.length" :key="i">-</span>
        </div>
        <div :class="$style.totalsColumn">
          <span v-for="total in totalsLabels" :key="total.currency">
            {{ fixed0(total.purchases) }}
          </span>
        </div>
        <div :class="[$style.totalsColumn, $style.totalsSeparator]">
          <span v-for="i in totalsLabels.length" :key="i">=</span>
        </div>
        <div :class="$style.totalsColumn">
          <span v-for="total in totalsLabels" :key="total.currency">
            {{ fixed0(total.total) }} {{ total.currency }}
          </span>
        </div>
      </div>
    </td>
  </tr>
</template>

<style module>
.column {
  border-left: none;
  border-bottom: 1px solid #2b485a;
  border-top: 1px solid #2b485a;
}

.totals {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  text-align: right;
}

.totalsColumn {
  display: flex;
  flex-direction: column;
}

.totalsSeparator {
  margin-left: 10px;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
}
</style>
