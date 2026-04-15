<script setup lang="ts">
import { BaseStorageAnalysis, buildProjectedStore } from '@src/core/storage-analysis';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import PrunButton from '@src/components/PrunButton.vue';
import CargoBar from '@src/components/CargoBar.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { fillRatioClass, formatDays } from '@src/features/XIT/STO/utils';

const { analysis } = defineProps<{
  analysis: BaseStorageAnalysis;
  hasMinimize?: boolean;
  minimized?: boolean;
  onClick: () => void;
}>();

const currentStore = computed(() => storagesStore.getById(analysis.storeId));
const projectedStore = computed(() => buildProjectedStore(analysis.siteId));

const projectedDebug = computed(() => {
  const s = projectedStore.value;
  if (!s) return 'no store';
  const wPct = ((s.weightLoad / s.weightCapacity) * 100).toFixed(0);
  const vPct = ((s.volumeLoad / s.volumeCapacity) * 100).toFixed(0);
  return `Projected: ${s.weightLoad.toFixed(0)} / ${s.weightCapacity.toFixed(0)} t (${wPct}%) · ${s.volumeLoad.toFixed(0)} / ${s.volumeCapacity.toFixed(0)} m³ (${vPct}%)`;
});

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
    <td :class="[$style.clickable, $style.barCell]" @click="onClick">
      <CargoBar :store="currentStore" />
    </td>
    <td
      :class="[$style.clickable, $style.barCell]"
      :data-tooltip="projectedDebug"
      data-tooltip-position="top"
      @click="onClick">
      <CargoBar :store="projectedStore" />
    </td>
    <td :class="$style.clickable" @click="onClick">
      <span :data-tooltip="limitTooltip" data-tooltip-position="bottom">
        {{ formatDays(analysis.daysUntilFull) }}
      </span>
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
</style>
