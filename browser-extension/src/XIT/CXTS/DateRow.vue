<script setup lang="ts">
import { computed, PropType } from 'vue';
import PrunCss from '@src/prun-ui/prun-css';
import { fixed2, mmddyyyy } from '@src/utils/format';

const props = defineProps({
  date: {
    type: Number,
    required: true,
  },
  totals: {
    type: Object as PropType<{ [currency: string]: number }>,
    required: true,
  },
});

const style = {
  borderLeft: 'none',
  borderBottom: '1px solid #2b485a',
  borderTop: '1px solid #2b485a',
};

const totals = computed(() => {
  return Object.keys(props.totals)
    .sort()
    .map(key => `${fixed2(props.totals[key])} ${key}`);
});
</script>

<template>
  <tr>
    <td colspan="2" :style="style">
      <span>{{ mmddyyyy(date) }}</span>
    </td>
    <!-- This <tr> is needed so both other <tr>s are the same color -->
    <td :style="{ display: 'none' }" />
    <td colspan="5" :style="style" :class="PrunCss.ComExOrdersTable.number">
      <template v-for="(total, i) in totals" :key="total">
        <span>{{ total }}</span>
        <br v-if="i !== totals.length - 1" />
      </template>
    </td>
  </tr>
</template>
