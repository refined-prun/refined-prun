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
}>();

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
    return 'Storage draining — not filling.';
  }
  return analysis.bindingLimit === 't'
    ? 'Weight is the binding limit.'
    : 'Volume is the binding limit.';
});

const supplyTooltip = computed(() => {
  if (!isFinite(analysis.daysOfSuppliesFit)) {
    return 'No active consumers — no supplies needed.';
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
    <td :class="$style.clickable" @click="onClick">
      <span :data-tooltip="limitTooltip" data-tooltip-position="bottom">
        {{ formatDays(analysis.daysUntilFull) }}
      </span>
    </td>
    <td :class="[$style.clickable, $style.supplyCell]" @click="onClick">
      <div v-if="supplyClass" :class="[$style.supplyBg, supplyClass]" />
      <span :data-tooltip="supplyTooltip" data-tooltip-position="bottom">
        {{ formatDaysCompact(analysis.daysOfSuppliesFit) }}
      </span>
    </td>
    <td :class="[$style.clickable, $style.barCell]" @click="onClick">
      <CargoBar :store="currentStore" disable-mini-mode />
    </td>
    <td :class="[$style.clickable, $style.barCell]" @click="onClick">
      <CargoBar :store="projectedStore" disable-mini-mode />
    </td>
    <td>
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
   days, cmd) — the bar cells dominate and split evenly. */
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
</style>
