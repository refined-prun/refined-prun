<script setup lang="ts">
import { PlatformProduction } from '@src/core/production';
import MaterialIcon from '@src/components/MaterialIcon.vue';

const { productionLine, headers } = defineProps<{
  productionLine: PlatformProduction;
  headers?: boolean;
}>();

interface StackedOrderGroup {
  ticker: string;
  count: number;
  amount: number;
  ts?: number;
  label?: string;
  isPlaceholder?: boolean;
  isQueued?: boolean;
}

const stackedActive = computed(() => {
  const groups: Record<string, StackedOrderGroup> = {};
  const BUCKET_MS = 10 * 60 * 1000;

  // Group existing orders
  productionLine.orders.forEach(order => {
    const output = order.outputs[0];
    if (!output) return;

    const ts = order.completion ? new Date(order.completion.timestamp).getTime() : 0;
    const bucket = Math.round(ts / BUCKET_MS);
    const key = `${order.recipeId}-${bucket}`;

    if (!groups[key]) {
      groups[key] = { ticker: output.material.ticker, count: 0, amount: 0, ts };
    }
    groups[key].count += 1;
    groups[key].amount += output.amount;
  });

  const results = Object.values(groups);

  // Unused Capacity logic

  if (productionLine.inactiveCapacity > 0) {
    results.push({
      ticker: 'N/A',
      count: productionLine.inactiveCapacity,
      amount: 0,
      label: 'Inactive',
      isPlaceholder: true,
    });
  }

  return results;
});

const stackedQueued = computed(() => {
  const groups: Record<string, StackedOrderGroup> = {};

  productionLine.queuedOrders.forEach(order => {
    const output = order.outputs[0];
    if (!output) return;

    const key = order.recipeId;
    if (!groups[key]) {
      groups[key] = { ticker: output.material.ticker, count: 0, amount: 0 };
    }
    groups[key].count += 1;
    groups[key].amount += output.amount;
  });

  const results = Object.values(groups);

  // Missing Queue logic
  if (productionLine.queuedOrders.length === 0) {
    results.push({
      ticker: 'N/A',
      count: 0,
      amount: 0,
      label: 'Not Queued',
      isPlaceholder: true,
    });
  }

  return results;
});

const allStackedOrders = computed(() => {
  return [
    ...stackedActive.value.map(group => ({ ...group, isQueued: false })),
    ...stackedQueued.value.map(group => ({ ...group, isQueued: true })),
  ];
});

const formatTime = (ts: number) => {
  const mins = Math.max(0, Math.floor((ts - Date.now()) / 60000));
  if (mins === 0) return 'Finishing...';
  return mins > 60 ? `in ${Math.floor(mins / 60)}h ${mins % 60}m` : `in ${mins}m`;
};
</script>

<template>
  <div>
    <table :class="$style.orderTable">
      <thead>
        <tr v-if="headers" :class="$style.headerRow">
          <th colspan="2">Order</th>
          <th :class="$style.right">Qty</th>
          <th :class="$style.right">Status / ETA</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(group, index) in allStackedOrders"
          :key="(group.isQueued ? 'q-' : 'a-') + group.ticker + (group.ts || index)">
          <td :class="[$style.noPadding, $style.buildingContainer]">
            <MaterialIcon :ticker="group.ticker" size="inline-table" />
          </td>
          <td>
            <span v-if="group.count > 1" :class="$style.stackCount">x{{ group.count }}</span>
          </td>
          <td :class="$style.right">{{ group.isPlaceholder ? '-' : group.amount }}</td>

          <td
            :class="[
              $style.right,
              group.isPlaceholder
                ? $style.dangerText
                : group.isQueued
                  ? $style.muted
                  : $style.activeText,
            ]">
            <template v-if="group.isPlaceholder">
              {{ group.label }}
            </template>
            <template v-else>
              {{ group.isQueued ? 'Queued' : group.ts ? formatTime(group.ts) : 'Error' }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style module>
.dangerText {
  color: #d9534f; /* Standard red for warnings/missing items */
  font-weight: bold;
}

.noPadding {
  padding: 0px;
}

.buildingContainer {
  width: 32px;
  height: 18px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  line-height: 0;
}

.orderTable {
  width: 100%;
  font-size: 11px;
  padding: 0px;
}

.headerRow th {
  text-align: left;
  padding-bottom: 2px;
  font-weight: normal;
  text-transform: uppercase;
  font-size: 9px;
  border-bottom: 1px solid inherit;
}

.right {
  text-align: right;
}

.stackCount {
  color: #3faabf;
  /* FIO Primary-ish blue */
  font-weight: bold;
  margin-left: 4px;
}

.activeText {
  color: #f0ad4e;
}

/* Orange for running orders */
.muted {
  color: var(--font-color-disabled);
  opacity: 0.7;
}
</style>
