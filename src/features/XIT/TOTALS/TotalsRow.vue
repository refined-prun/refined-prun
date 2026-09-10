<script setup lang="ts">
import { ItemTotalStatus } from '@src/core/item-totals';
import MaterialIcon from '@src/components/MaterialIcon.vue';
import {
  formatAmount,
  formatValue,
  formatVolume,
  formatWeight,
} from '@src/features/XIT/TOTALS/utils';

const { row, codes } = defineProps<{
  row: ItemTotalStatus;
  codes: string[];
  showWv?: boolean;
}>();

const values = computed(() => row.values.filter(x => codes.includes(x.code)));
</script>

<template>
  <tr>
    <td :class="$style.itemColumn">
      <MaterialIcon size="inline-table" :ticker="row.ticker" />
    </td>
    <td>{{ formatAmount(row.amount) }}</td>
    <template v-if="showWv">
      <td :class="$style.numberColumn">{{ formatWeight(row.weight) }}</td>
      <td :class="$style.numberColumn">{{ formatVolume(row.volume) }}</td>
    </template>
    <td v-for="value in values" :key="value.code" :class="$style.numberColumn">
      {{ formatValue(value.value, value.currency) }}
    </td>
  </tr>
</template>

<style module>
.itemColumn {
  width: 32px;
  padding: 0;
}

.numberColumn {
  text-align: right;
}
</style>
