<script setup lang="ts">
import PrunCss from '@src/prun-ui/prun-css';
import { formatAmount } from './utils';

defineProps({
  name: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  rows: {
    type: Array<[string, number]>,
    required: true,
  },
});
</script>

<template>
  <tbody>
    <tr>
      <th colspan="5">{{ name }}</th>
    </tr>
    <tr v-for="row in rows" :key="row[0]">
      <td>{{ row[0] }}</td>
      <td>{{ formatAmount(row[1]) }}</td>
      <td>--</td>
      <td>--</td>
      <td>--</td>
    </tr>
    <tr :class="PrunCss.IncomeStatementPanel.totals">
      <td :class="PrunCss.IncomeStatementPanel.number">Total {{ name }}</td>
      <td>{{ formatAmount(total) }}</td>
      <td>--</td>
      <td>--</td>
      <td>--</td>
    </tr>
  </tbody>
</template>

<style scoped>
tbody tr > *:not(:first-child) {
  text-align: right;
}
</style>
