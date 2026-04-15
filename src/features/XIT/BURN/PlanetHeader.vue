<script setup lang="ts">
import DaysCell from '@src/features/XIT/BURN/DaysCell.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import PrunButton from '@src/components/PrunButton.vue';
import { PlanetBurn } from '@src/core/burn';
import { computeNeed, countDays } from '@src/features/XIT/BURN/utils';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { userData } from '@src/store/user-data';
import { fixed0 } from '@src/utils/format';

const { burn } = defineProps<{
  burn: PlanetBurn;
  hasMinimize?: boolean;
  minimized?: boolean;
  onClick: () => void;
}>();

const days = computed(() => countDays(burn.burn));

const capacity = computed(() => {
  const site = sitesStore.getByPlanetNaturalId(burn.naturalId);
  if (!site) {
    return undefined;
  }
  const store = storagesStore.getByAddressableId(site.siteId)?.find(x => x.type === 'STORE');
  if (!store) {
    return undefined;
  }

  let addedVolume = 0;
  let addedWeight = 0;
  for (const ticker of Object.keys(burn.burn)) {
    const need = computeNeed(burn.burn[ticker], userData.settings.burn.resupply);
    if (need <= 0) {
      continue;
    }
    const mat = materialsStore.getByTicker(ticker);
    if (!mat) {
      continue;
    }
    addedVolume += mat.volume * need;
    addedWeight += mat.weight * need;
  }
  if (addedVolume === 0 && addedWeight === 0) {
    return undefined;
  }

  const volRatio = (store.volumeLoad + addedVolume) / store.volumeCapacity;
  const wtRatio = (store.weightLoad + addedWeight) / store.weightCapacity;
  return { volRatio, wtRatio, worst: Math.max(volRatio, wtRatio) };
});

const capacityClass = computed(() => {
  if (!capacity.value) {
    return undefined;
  }
  if (capacity.value.worst > 1) {
    return C.Workforces.daysMissing;
  }
  if (capacity.value.worst > 0.8) {
    return C.Workforces.daysWarning;
  }
  return C.Workforces.daysSupplied;
});

const capacityTooltip = computed(() => {
  if (!capacity.value) {
    return undefined;
  }
  return `After delivery — Vol: ${fixed0(capacity.value.volRatio * 100)}% · Wt: ${fixed0(capacity.value.wtRatio * 100)}%`;
});
</script>

<template>
  <tr :class="$style.row">
    <td colspan="4" :class="$style.cell" @click="onClick">
      <div
        v-if="capacityClass"
        :class="[$style.stripe, capacityClass]"
        :data-tooltip="capacityTooltip"
        data-tooltip-position="bottom" />
      <span v-if="hasMinimize" :class="$style.minimize">
        {{ minimized ? '+' : '-' }}
      </span>
      <span>{{ burn.planetName }}</span>
    </td>
    <DaysCell :days="days" />
    <td>
      <div :class="$style.buttons">
        <PrunButton dark inline @click="showBuffer(`BS ${burn.naturalId}`)">BS</PrunButton>
        <PrunButton dark inline @click="showBuffer(`INV ${burn.storeId.substring(0, 8)}`)">
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

.cell {
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
  position: relative;
}

.stripe {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.minimize {
  display: inline-block;
  width: 26px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 0.25rem;
}
</style>
