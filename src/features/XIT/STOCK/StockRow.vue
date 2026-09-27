<script setup lang="ts">
import { StockItemStatus } from '@src/core/stock';
import MaterialIcon from '@src/components/MaterialIcon.vue';
import StockDaysCell from '@src/features/XIT/STOCK/StockDaysCell.vue';
import { fixed0, fixed01, percent0, percent1 } from '@src/utils/format';

const { item } = defineProps<{ item: StockItemStatus }>();

const currentText = computed(() =>
  item.current >= 100 ? fixed0(item.current) : fixed01(item.current),
);
const maxText = computed(() => fixed0(item.max));

const percentText = computed(() => {
  if (!isFinite(item.percent)) {
    return '∞';
  }
  return item.percent >= 1 ? percent0(item.percent) : percent1(item.percent);
});

const percentClass = computed(() => ({
  [C.ColoredValue.positive]: item.percent >= 1,
  [C.ColoredValue.negative]: item.danger,
}));
</script>

<template>
  <tr>
    <td :class="$style.iconColumn">
      <MaterialIcon v-if="item.ticker" size="inline-table" :ticker="item.ticker" />
    </td>
    <td>
      <span>
        {{ currentText }}<span :class="$style.slash">/</span>{{ maxText }}
        <span v-if="item.warehouse" :class="$style.warehouse" title="Includes warehouse">+W</span>
      </span>
    </td>
    <td>
      <span :class="percentClass">{{ percentText }}</span>
    </td>
    <StockDaysCell :days="item.days" :danger="item.danger" />
  </tr>
</template>

<style module>
.iconColumn {
  width: 32px;
  padding: 0;
}

.slash {
  color: #999;
  margin: 0 1px;
}

.warehouse {
  color: #999;
  font-size: 11px;
  margin-left: 3px;
}
</style>
