<script setup lang="ts">
import { fixed0, ddmmyyyy } from '@src/utils/format';

const { totals } = defineProps<{ date: number; totals: { [currency: string]: number } }>();

const style = {
  borderLeft: 'none',
  borderBottom: '1px solid #2b485a',
  borderTop: '1px solid #2b485a',
};

const totalsLabels = computed(() => {
  return Object.keys(totals)
    .sort()
    .map(key => `${fixed0(totals[key])} ${key}`);
});
</script>

<template>
  <tr>
    <td colspan="2" :style="style">
      <span>{{ ddmmyyyy(date) }}</span>
    </td>
    <!-- This <tr> is needed so both other <tr>s are the same color -->
    <td :style="{ display: 'none' }" />
    <td colspan="5" :style="style" :class="C.ComExOrdersTable.number">
      <template v-for="(total, i) in totalsLabels" :key="total">
        <span>{{ total }}</span>
        <br v-if="i !== totalsLabels.length - 1" />
      </template>
    </td>
  </tr>
</template>
