<script setup lang="ts">
import { useTileState } from '@src/features/XIT/BURN/tile-state';
import PrunButton from '@src/components/PrunButton.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { userData } from '@src/store/user-data';
import BuildingIcon from '@src/components/BuildingIcon.vue';
import { PlatformProduction } from '@src/core/production';
import { percent0, percent2 } from '@src/utils/format';
import FracCell from './FracCell.vue';
import InlineFlex from '@src/components/InlineFlex.vue';
import Tooltip from '@src/components/Tooltip.vue';
import ProductionOrdersTable from './ProductionOrdersTable.vue';

const { alwaysVisible, productionLine, headers } = defineProps<{
  alwaysVisible?: boolean;
  productionLine: PlatformProduction;
  headers?: boolean;
}>();

const capacity = computed(() => productionLine.capacity);
const efficiency = computed(() => productionLine.efficiency ?? 0);
const activeOrders = computed(() => productionLine.orders.length);
const condition = computed(() => productionLine.condition);

const isRed = computed(() => condition.value <= userData.settings.burn.red);
const isYellow = computed(() => condition.value <= userData.settings.burn.yellow);
const isGreen = computed(() => condition.value > userData.settings.burn.yellow);

const red = useTileState('red');
const yellow = useTileState('yellow');
const green = useTileState('green');
const inf = useTileState('inf');

const isVisible = computed(() => {
  if (alwaysVisible) {
    return true;
  }
  return (
    (isRed.value && red.value) || (isYellow.value && yellow.value) || (isGreen.value && green.value)
  );
});

const isInvisible = computed(() => !isVisible.value);

const expand = useTileState('expand');

const id = computed(() => productionLine.id);
const isMinimized = computed(() => !expand.value.includes(id.value));

const onHeaderClick = () => {
  if (isMinimized.value) {
    expand.value = [...expand.value, id.value];
  } else {
    expand.value = expand.value.filter(x => x !== id.value);
  }
};

const tooltipText = computed(() => {
  const lines = [`Condition: ${percent0(condition.value)}`];

  if (productionLine.efficiencyFactors?.length) {
    lines.push(''); // Add a spacer

    productionLine.efficiencyFactors.forEach(factor => {
      // Only map labels that aren't a simple capitalization of the key
      const labels: Partial<Record<PrunApi.EfficiencyFactorType, string>> = {
        COGC_PROGRAM: 'COGC',
        COMPANY_HEADQUARTERS: 'HQ',
        PRODUCTION_LINE_CONDITION: 'Condition',
      };

      const capitalize = (str: string) => {
        return str
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      };

      // Use the mapped label if it exists; otherwise, capitalize the raw type
      const rawLabel = labels[factor.type] || factor.type;
      const label = capitalize(rawLabel);

      // Fix capitalization for the expertise category as well
      const category = factor.expertiseCategory ? ` (${capitalize(factor.expertiseCategory)})` : '';

      lines.push(`${label}${category}: ${percent2(factor.value)}`);
      lines.push(''); // Add a spacer
    });
  }
  const fixedWidth = 22;
  //\u00A0
  //return lines.map(line => line.padEnd(fixedWidth, '-')).join('\n');
  return lines.join(' ');
});
</script>

<template>
  <tr v-if="isVisible" :class="[!isMinimized && $style.row]">
    <td :class="[$style.buildingContainer, $style.noPadding, $style.flex]">
      <BuildingIcon size="inline-table" :ticker="productionLine.reactorTicker" />
    </td>

    <td @click="onHeaderClick" :class="$style.trigger">
      <span :class="[$style.caret, !isMinimized && $style.expanded]">▶</span>
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
      <div :class="[$style.flex, $style.buttons]">
        <PrunButton dark inline @click="showBuffer(`PRODCO ${productionLine.id}`)">CO</PrunButton>
        <PrunButton dark inline @click="showBuffer(`PRODQ ${productionLine.id}`)">Q</PrunButton>
      </div>
    </td>
  </tr>
  <tr v-if="!isMinimized">
    <td colspan="1">
      <div></div>
    </td>
    <td colspan="4" :class="$style.noPadding">
      <ProductionOrdersTable :production-line="productionLine" :headers="headers" />
    </td>
  </tr>
</template>

<style module>
.row {
  border-bottom: 1px solid #2b485a;
}

.buttons {
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 0.25rem;
}

.flex {
  display: flex;
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

.spacer {
  flex-grow: 1;
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
