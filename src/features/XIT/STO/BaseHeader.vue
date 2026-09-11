<script setup lang="ts">
import { BaseStorageAnalysis, buildProjectedStore } from '@src/core/storage-analysis';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { userData } from '@src/store/user-data';
import PrunButton from '@src/components/PrunButton.vue';
import CargoBar from '@src/components/CargoBar.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { fillRatioClass, formatDays, formatDaysCompact } from '@src/features/XIT/STO/utils';
import { fixed01 } from '@src/utils/format';

const { analysis } = defineProps<{
  analysis: BaseStorageAnalysis;
  hasMinimize?: boolean;
  minimized?: boolean;
  onClick: () => void;
  tooltipPosition?: string;
  hideButtons?: boolean;
  showColumnTooltips?: boolean;
  planetOnlyClick?: boolean;
}>();

const COLUMN_LIMIT_TOOLTIP =
  'Days until storage is full at the current net production rate - when a ship visit is forced.';
const COLUMN_SUPPLY_TOOLTIP =
  'Total days of consumables the base could hold when storage is filled to its threshold after ship-out (80% when filling, 95% when draining). Colors match XIT BURN: red below your red threshold, yellow below your yellow threshold.';
const COLUMN_CURRENT_FILL_TOOLTIP =
  "What's in base storage right now. Colored by material category.";
const COLUMN_AFTER_RESUPPLY_TOOLTIP =
  'Projected storage if all produced goods were shipped out and all consumables delivered up to their XIT BURN Need amount. Red hatching shows overflow past capacity.';

const currentStore = computed(() => storagesStore.getById(analysis.storeId));
const projectedStore = computed(() => buildProjectedStore(analysis.siteId));

const stripeClass = computed(() => {
  if (analysis.needFillRatio === 0) {
    return undefined;
  }
  return fillRatioClass(analysis.needFillRatio);
});

const limitTooltip = computed(() => {
  if (analysis.bindingLimit === undefined) {
    return 'Storage draining - not filling.';
  }
  return analysis.bindingLimit === 't'
    ? 'Weight is the binding limit.'
    : 'Volume is the binding limit.';
});

const supplyTooltip = computed(() => {
  if (!isFinite(analysis.daysOfSuppliesFit)) {
    return 'No active consumers - no supplies needed.';
  }
  const pct = Math.round((1 - analysis.suppliesReserveFraction) * 100);
  const reason =
    analysis.suppliesReserveFraction >= 0.2
      ? 'produced goods that keep accumulating'
      : 'production variance';
  return `${fixed01(analysis.daysOfSuppliesFit)} days total when storage is filled to ${pct}% after ship-out (remainder reserved for ${reason}).`;
});

const supplyClass = computed(() => {
  const floored = Math.floor(analysis.daysOfSuppliesFit);
  if (!isFinite(analysis.daysOfSuppliesFit)) {
    return undefined;
  }
  return {
    [C.Workforces.daysMissing]: floored <= userData.settings.burn.red,
    [C.Workforces.daysWarning]: floored <= userData.settings.burn.yellow,
    [C.Workforces.daysSupplied]: floored > userData.settings.burn.yellow,
  };
});
</script>

<template>
  <tr :class="$style.row">
    <td :class="[$style.planet, $style.clickable]" @click="onClick">
      <div v-if="stripeClass" :class="[$style.stripe, stripeClass]" />
      <span v-if="hasMinimize" :class="$style.minimize">
        {{ minimized ? '+' : '-' }}
      </span>
      <span>{{ analysis.planetName }}</span>
    </td>
    <td
      :class="[!planetOnlyClick && $style.clickable, $style.noWrap]"
      v-on="planetOnlyClick ? {} : { click: onClick }">
      <span
        :class="showColumnTooltips ? [C.Tooltip.container, $style.tooltip] : undefined"
        :data-tooltip="showColumnTooltips ? COLUMN_LIMIT_TOOLTIP : limitTooltip"
        :data-tooltip-position="tooltipPosition ?? 'bottom'">
        {{ formatDays(analysis.daysUntilFull) }}
      </span>
    </td>
    <td
      :class="[!planetOnlyClick && $style.clickable, $style.supplyCell, $style.noWrap]"
      v-on="planetOnlyClick ? {} : { click: onClick }">
      <div v-if="supplyClass" :class="[$style.supplyBg, supplyClass]" />
      <span
        :class="showColumnTooltips ? [C.Tooltip.container, $style.tooltip] : undefined"
        :data-tooltip="showColumnTooltips ? COLUMN_SUPPLY_TOOLTIP : supplyTooltip"
        :data-tooltip-position="tooltipPosition ?? 'bottom'">
        {{ formatDaysCompact(analysis.daysOfSuppliesFit) }}
      </span>
    </td>
    <td
      :class="[!planetOnlyClick && $style.clickable, $style.barCell]"
      v-on="planetOnlyClick ? {} : { click: onClick }">
      <div
        v-if="showColumnTooltips"
        :class="$style.colBg"
        :data-tooltip="COLUMN_CURRENT_FILL_TOOLTIP"
        :data-tooltip-position="tooltipPosition ?? 'bottom'">
        <CargoBar :store="currentStore" disable-mini-mode />
      </div>
      <CargoBar v-else :store="currentStore" disable-mini-mode />
    </td>
    <td
      :class="[!planetOnlyClick && $style.clickable, $style.barCell]"
      v-on="planetOnlyClick ? {} : { click: onClick }">
      <div
        v-if="showColumnTooltips"
        :class="$style.colBg"
        :data-tooltip="COLUMN_AFTER_RESUPPLY_TOOLTIP"
        :data-tooltip-position="tooltipPosition ?? 'bottom'">
        <CargoBar :store="projectedStore" disable-mini-mode />
      </div>
      <CargoBar v-else :store="projectedStore" disable-mini-mode />
    </td>
    <td v-if="!hideButtons">
      <div :class="$style.buttons">
        <PrunButton dark inline @click="showBuffer(`BS ${analysis.naturalId}`)">BS</PrunButton>
        <PrunButton dark inline @click="showBuffer(`INV ${analysis.storeId.substring(0, 8)}`)">
          INV
        </PrunButton>
      </div>
    </td>
  </tr>
</template>

<style module>
.row {
  border-bottom: 1px solid #2b485a;
}

.planet {
  font-weight: bold;
  font-size: 12px;
  position: relative;
  padding-left: 12px;
  white-space: nowrap;
}

.stripe {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
}

.clickable {
  cursor: pointer;
}

.noWrap {
  white-space: nowrap;
}

.tooltip {
  white-space: normal;
}

.minimize {
  display: inline-block;
  width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 0.25rem;
}

/* Equal width for both CargoBar cells. Using width:50% on each cell makes
   them split the remaining table width after fixed-size columns (planet,
   days, cmd) - the bar cells dominate and split evenly. */
.barCell {
  width: 50%;
  vertical-align: middle;
}

.supplyCell {
  position: relative;
}

.supplyBg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

/* Fills the td so background hover area covers empty space around the value. */
.colBg {
  display: block;
  position: relative;
  z-index: 1;
}
</style>
