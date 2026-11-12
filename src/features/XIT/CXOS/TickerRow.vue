<script setup lang="ts">
import { C } from '@src/infrastructure/prun-ui/prun-css';
import { fixed0 } from '@src/utils/format';
import type { AggregatedTicker } from './CXOS.vue';
import { openTickerDetails } from './multi-buffer';

const { data } = defineProps<{
  data: AggregatedTicker;
}>();

const onTickerClick = async () => {
  await openTickerDetails(data.ticker, data.exchange);
};
</script>

<template>
  <tr>
    <td>
      <span :class="C.Link.link" @click="onTickerClick">
        {{ data.id }}
      </span>
    </td>
    <td style="text-align: right">{{ fixed0(data.totalVolume) }} {{ data.currency }}</td>
    <td style="text-align: right; color: #5cb85c"
      >{{ fixed0(data.buyVolume) }} {{ data.currency }}</td
    >
    <td style="text-align: right; color: #d9534f"
      >{{ fixed0(data.sellVolume) }} {{ data.currency }}</td
    >
  </tr>
</template>
