<script setup lang="ts">
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import PrunButton from '@src/components/PrunButton.vue';
import { PlanetProduction } from '@src/core/production';
import { sumBy } from '@src/utils/sum-by';
import FracCell from './FracCell.vue';

const { production } = defineProps<{
  production: PlanetProduction;
  hasMinimize?: boolean;
  minimized?: boolean;
  onClick: () => void;
}>();

const totalOrders = computed(() => sumBy(production.production, x => x.orders.length));

const totalCapacity = computed(() => sumBy(production.production, x => x.capacity));
</script>

<template>
  <tr :class="$style.row">
    <td colspan="3" :class="$style.cell" @click="onClick">
      <span v-if="hasMinimize" :class="$style.minimize">
        {{ minimized ? '+' : '-' }}
      </span>
      <span>{{ production.planetName }}</span>
    </td>
    <FracCell :numerator="totalOrders" :denominator="totalCapacity" />
    <td>
      <div :class="$style.buttons">
        <PrunButton dark inline @click="showBuffer(`BS ${production.naturalId}`)">BS</PrunButton>
        <PrunButton dark inline @click="showBuffer(`INV ${production.storeId.substring(0, 8)}`)">
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
