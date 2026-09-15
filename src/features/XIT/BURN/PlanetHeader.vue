<script setup lang="ts">
import DaysCell from '@src/features/XIT/BURN/DaysCell.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import PrunButton from '@src/components/PrunButton.vue';
import { PlanetBurn } from '@src/core/burn';
import { countDays } from '@src/features/XIT/BURN/utils';
import { planetContextMenu } from '@src/components/planet-context-menu/planet-context-menu';
import { useTileState } from '@src/features/XIT/BURN/tile-state';
import fa from '@src/utils/font-awesome.module.css';

const { burn } = defineProps<{
  burn: PlanetBurn;
  hasInboundShips: boolean;
  hasMinimize?: boolean;
  minimized?: boolean;
  onClick: () => void;
}>();

const io = useTileState('io');
const excludeInbound = useTileState('excludeInbound');
const includesInbound = computed(() => !excludeInbound.value.includes(burn.naturalId));
const inboundTooltip = computed(() =>
  includesInbound.value
    ? 'Includes inbound cargo. Click to exclude them.'
    : 'Excludes inbound cargo. Click to include them.',
);
const days = computed(() => countDays(burn.burn));
const nameColspan = computed(() => (io.value ? 6 : 4));

function toggleInbound() {
  excludeInbound.value = includesInbound.value
    ? [...excludeInbound.value, burn.naturalId]
    : excludeInbound.value.filter(x => x !== burn.naturalId);
}
</script>

<template>
  <tr :class="$style.row">
    <td
      :colspan="nameColspan"
      :class="$style.cell"
      @click="onClick"
      @contextmenu.prevent="burn.naturalId && planetContextMenu.showMenu($event, burn.naturalId)">
      <span v-if="hasMinimize" :class="$style.minimize">
        {{ minimized ? '+' : '-' }}
      </span>
      <span>{{ burn.planetName }}</span>
      <button
        v-if="hasInboundShips"
        type="button"
        :class="[fa.solid, $style.inbound, { [$style.inboundExcluded]: !includesInbound }]"
        :data-tooltip="inboundTooltip"
        :aria-label="inboundTooltip"
        :aria-pressed="includesInbound"
        @click.stop="toggleInbound">
        {{ '\uf135' }}
      </button>
    </td>
    <DaysCell :days="days" />
    <td>
      <div :class="$style.buttons">
        <PrunButton dark inline @click="showBuffer(`BS ${burn.naturalId}`)">BS</PrunButton>
        <PrunButton dark inline @click="showBuffer(`INV ${burn.storeId.substring(0, 8)}`)">
          INV
        </PrunButton>
        <PrunButton dark inline @click="showBuffer(`XIT BURNACT ${burn.naturalId}`)">
          ACT
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
}

.minimize {
  display: inline-block;
  width: 26px;
  text-align: center;
}

.inbound {
  float: right;
  border: 0;
  padding: 0;
  background: none;
  color: inherit;
  cursor: pointer;
  font-size: 12px;
  line-height: inherit;
}

.inboundExcluded {
  color: #666;
}

.buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 0.25rem;
}
</style>
