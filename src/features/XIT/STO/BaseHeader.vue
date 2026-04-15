<script setup lang="ts">
import { BaseStorageAnalysis } from '@src/core/storage-analysis';
import PrunButton from '@src/components/PrunButton.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { percent0 } from '@src/utils/format';
import { fillRatioClass, formatDays, worstFillPercent } from '@src/features/XIT/STO/utils';

const { analysis } = defineProps<{
  analysis: BaseStorageAnalysis;
  hasMinimize?: boolean;
  minimized?: boolean;
  onClick: () => void;
}>();

const fill = computed(() => worstFillPercent(analysis));
const fillClass = computed(() => fillRatioClass(fill.value));

const fillTooltip = computed(
  () =>
    `Wt: ${percent0(analysis.fillPercentWeight)} · Vol: ${percent0(analysis.fillPercentVolume)}`,
);

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
    <td :class="$style.planet" @click="onClick">
      <span v-if="hasMinimize" :class="$style.minimize">
        {{ minimized ? '+' : '-' }}
      </span>
      <span>{{ analysis.planetName }}</span>
    </td>
    <td :style="{ position: 'relative' }">
      <div
        :style="{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }"
        :class="fillClass" />
      <span :data-tooltip="fillTooltip" data-tooltip-position="bottom">
        {{ percent0(fill) }}
      </span>
    </td>
    <td>{{ formatDays(analysis.daysUntilFull) }}</td>
    <td :data-tooltip="limitTooltip" data-tooltip-position="bottom">
      {{ analysis.bindingLimit ?? '—' }}
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
  cursor: pointer;
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
