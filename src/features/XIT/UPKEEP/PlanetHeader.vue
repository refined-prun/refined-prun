<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses.ts';
import { createUpkeep } from '@src/store/upkeeps.ts';

const { site, onClick, minimized } = defineProps<{
  site: PrunApi.Site;
  hasMinimize?: boolean;
  minimized?: boolean;
  onClick: () => void;
}>();

const onAddClick = () => {
  createUpkeep('', site.siteId);
  if (minimized) {
    onClick();
  }
};
</script>

<template>
  <tr :class="$style.row">
    <td colspan="5" :class="$style.cell" @click="onClick">
      <span v-if="hasMinimize" :class="$style.minimize">
        {{ minimized ? '+' : '-' }}
      </span>
      <span>{{ getEntityNameFromAddress(site.address) }}</span>
    </td>
    <td>
      <div :class="$style.buttons">
        <PrunButton primary inline @click="onAddClick">ADD</PrunButton>
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
