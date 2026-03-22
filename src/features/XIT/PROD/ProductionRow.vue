<script setup lang="ts">
import { useTileState } from './tile-state';
import PrunButton from '@src/components/PrunButton.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import BuildingIcon from '@src/components/BuildingIcon.vue';
import { PlatformProduction } from '@src/core/production';
import { percent0, percent2 } from '@src/utils/format';
import FracCell from './FracCell.vue';
import InlineFlex from '@src/components/InlineFlex.vue';
import Tooltip from '@src/components/Tooltip.vue';
import ProductionOrdersTable from './ProductionOrdersTable.vue';
import IconCell from './IconCell.vue';

const { productionLine, headers } = defineProps<{
  productionLine: PlatformProduction;
  headers?: boolean;
}>();

const capacity = computed(() => productionLine.capacity);
const efficiency = computed(() => productionLine.efficiency ?? 0);
const activeOrders = computed(() => productionLine.orders.length);
const condition = computed(() => productionLine.condition);
const expandInfo = useTileState('expandInfo');
const id = computed(() => productionLine.id);
const displayInfo = computed(() => expandInfo.value.includes(id.value));

const onHeaderClick = () => {
  if (displayInfo.value) {
    expandInfo.value = expandInfo.value.filter(x => x !== id.value);
  } else {
    expandInfo.value = [...expandInfo.value, id.value];
  }
};

const labels: Partial<Record<PrunApi.EfficiencyFactorType, string>> = {
  COGC_PROGRAM: 'CoGC',
  COMPANY_HEADQUARTERS: 'HQ',
  PRODUCTION_LINE_CONDITION: 'Condition',
};

const capitalize = (str: string) => {
  return str
    .split('_')
    .map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
    .join(' ');
};

const tooltipLines = computed(() => {
  const lines = [`Condition: ${percent0(condition.value)}`];

  if (productionLine.efficiencyFactors.length === 0) {
    return lines;
  }

  lines.push('');

  for (const factor of productionLine.efficiencyFactors) {
    const label = labels[factor.type] ?? capitalize(factor.type);
    const category = factor.expertiseCategory ? ` (${capitalize(factor.expertiseCategory)})` : '';

    lines.push(`${label}${category}: ${percent2(factor.value)}`);
    lines.push('');
  }

  return lines;
});

const tooltipText = computed(() => tooltipLines.value.join(' '));
</script>

<template>
  <tr :class="$style.row">
    <IconCell>
      <BuildingIcon size="inline-table" :ticker="productionLine.reactorTicker" />
    </IconCell>

    <td :class="$style.trigger" @click="onHeaderClick">
      <span :class="[$style.caret, displayInfo && $style.expanded]">▶</span>
      <span :class="$style.collapseText">INFO</span>
    </td>
    <td>
      <InlineFlex>
        {{ percent0(efficiency) }}
        <Tooltip position="bottom" :tooltip="tooltipText" />
      </InlineFlex>
    </td>
    <FracCell :numerator="activeOrders" :denominator="capacity" />
    <td>
      <div :class="$style.buttons">
        <PrunButton dark inline @click="showBuffer(`PRODCO ${productionLine.id}`)">CO</PrunButton>
        <PrunButton dark inline @click="showBuffer(`PRODQ ${productionLine.id}`)">Q</PrunButton>
      </div>
    </td>
  </tr>
  <tr v-if="displayInfo">
    <td>
      <div></div>
    </td>
    <td colspan="4" :class="$style.ordersCell">
      <ProductionOrdersTable :production-line="productionLine" :headers="headers" />
    </td>
  </tr>
</template>

<style module>
.row {
  border-bottom: 1px solid #2b485a;
}

.buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 0.25rem;
}

.ordersCell {
  padding: 0;
}

.trigger {
  cursor: pointer;
  user-select: none;
  align-items: center;
}

.collapseText {
  font-size: 10px;
  text-transform: uppercase;
}

.caret {
  display: inline-block;
  transition: transform 0.2s ease;
  font-size: 0.7rem;
  margin-right: 2px;
}

.expanded {
  transform: rotate(90deg);
}
</style>
