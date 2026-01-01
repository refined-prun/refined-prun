<script setup lang="ts">
import { useTileState } from '@src/features/XIT/BURN/tile-state.ts';
import PlanetHeader from '@src/features/XIT/UPKEEP/PlanetHeader.vue';
import MaterialRow from '@src/features/XIT/UPKEEP/MaterialRow.vue';

const { site, upkeeps, canMinimize } = defineProps<{
  site: PrunApi.Site;
  upkeeps: UserData.Upkeep[];
  canMinimize?: boolean;
}>();

const expand = useTileState('expand');

const isMinimized = computed(() => canMinimize && !expand.value.includes(site.siteId));

const onHeaderClick = () => {
  if (!canMinimize) {
    return;
  }
  if (isMinimized.value) {
    expand.value = [...expand.value, site.siteId];
  } else {
    expand.value = expand.value.filter(x => x !== site.siteId);
  }
};
</script>

<template>
  <tbody>
    <PlanetHeader
      :site="site"
      :on-click="onHeaderClick"
      :has-minimize="canMinimize"
      :minimized="isMinimized" />
  </tbody>
  <tbody v-if="!isMinimized && upkeeps && upkeeps.length > 0">
    <MaterialRow v-for="upkeep in upkeeps" :key="upkeep.id" :upkeep="upkeep" />
  </tbody>
</template>

<style module></style>
