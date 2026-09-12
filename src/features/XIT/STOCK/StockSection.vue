<script setup lang="ts">
import { StockPlanetStatus } from '@src/core/stock';
import StockRow from '@src/features/XIT/STOCK/StockRow.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { useTileState } from '@src/features/XIT/STOCK/tile-state';

const { section, canMinimize } = defineProps<{
  section: StockPlanetStatus;
  canMinimize?: boolean;
}>();

const expand = useTileState('expand');
const key = computed(() => section.naturalId || section.planet);
const isMinimized = computed(() => canMinimize && !expand.value.includes(key.value));

function onHeaderClick() {
  if (!canMinimize) {
    return;
  }
  if (isMinimized.value) {
    expand.value = [...expand.value, key.value];
  } else {
    expand.value = expand.value.filter(x => x !== key.value);
  }
}
</script>

<template>
  <tbody>
    <tr :class="$style.row">
      <td colspan="3" :class="$style.cell" @click="onHeaderClick">
        <span v-if="canMinimize" :class="$style.minimize">{{ isMinimized ? '+' : '-' }}</span>
        <span>{{ section.planetName }}</span>
        <span v-if="!section.found" :class="$style.notFound"> (not found)</span>
      </td>
      <td>
        <div :class="$style.buttons">
          <PrunButton
            v-if="section.found"
            dark
            inline
            @click="showBuffer(`BS ${section.naturalId}`)">
            BS
          </PrunButton>
          <PrunButton
            v-if="section.storeId"
            dark
            inline
            @click="showBuffer(`INV ${section.storeId.substring(0, 8)}`)">
            INV
          </PrunButton>
        </div>
      </td>
    </tr>
  </tbody>
  <tbody v-if="!isMinimized">
    <tr v-if="section.items.length === 0">
      <td colspan="4" :class="$style.emptyRow">No items configured.</td>
    </tr>
    <StockRow v-for="item in section.items" :key="item.ticker" :item="item" />
  </tbody>
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

.notFound {
  color: #d9534f;
  font-weight: normal;
}

.buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 0.25rem;
}

.emptyRow {
  text-align: center;
  color: #999;
}
</style>
