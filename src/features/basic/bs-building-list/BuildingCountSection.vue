<script setup lang="ts">
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import BuildingIcon from '@src/components/BuildingIcon.vue';

const { naturalId } = defineProps<{ naturalId: string }>();

const buildings = computed(() => {
  const totals = new Map<string, number>();
  const buildings = sitesStore.getByPlanetNaturalId(naturalId)?.platforms ?? [];
  for (const building of buildings) {
    const ticker = building.module.reactorTicker;
    totals.set(ticker, (totals.get(ticker) ?? 0) + 1);
  }
  const keys = [...totals.keys()];
  keys.sort();
  return keys.map(x => [x, totals.get(x)!] as [string, number]);
});
</script>

<template>
  <h2 :class="[C.Site.header, C.ui.header2, C.fonts.fontRegular]">Buildings</h2>
  <div :class="$style.list">
    <BuildingIcon
      v-for="building in buildings"
      :key="building[0]"
      :ticker="building[0]"
      :amount="building[1]" />
  </div>
</template>

<style module>
.list {
  padding: 5px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 5px;
}
</style>
