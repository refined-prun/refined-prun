<script setup lang="ts">
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { userData } from '@src/store/user-data';
import { isEmpty } from 'ts-extras';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites.ts';
import { useTileState } from '@src/features/XIT/UPKEEP/tile-state.ts';
import UpkeepSection from '@src/features/XIT/UPKEEP/UpkeepSection.vue';
import { createId } from '@src/store/create-id.ts';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials.ts';
import MaterialRow from '@src/features/XIT/UPKEEP/MaterialRow.vue';

const parameters = useXitParameters();

const isUpkeepAll = isEmpty(parameters) || parameters[0].toLowerCase() == 'all';

const sites = computed(() => {
  if (isUpkeepAll) {
    return sitesStore.all.value;
  }

  return parameters.map(x => sitesStore.getByPlanetNaturalIdOrName(x)).filter(x => x !== undefined);
});

const upkeeps = computed(
  () =>
    Object.fromEntries(
      (sites.value ?? []).map(site => {
        return [site.siteId, userData.upkeeps[site.siteId]];
      }),
    ) as Record<string, UserData.Upkeep[]>,
);

const expand = useTileState('expand');

const anyExpanded = computed(() => expand.value.length > 0);

function onExpandAllClick() {
  if (expand.value.length > 0) {
    expand.value = [];
  } else {
    expand.value = Object.keys(upkeeps.value);
  }
}

const fakeUpkeep: UserData.Upkeep = {
  id: createId(),
  siteId: sites.value![0].siteId,
  name: '',
  duration: {
    millis: 1000,
  },
  matAmounts: [
    {
      material: materialsStore.getByTicker('RAT')!,
      amount: 1,
    },
  ],
};
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-if="sites && sites.length > 0" :class="$style.expand" @click="onExpandAllClick">
          {{ anyExpanded ? '-' : '+' }}
        </th>
        <th v-else />
        <th>Ticker</th>
        <th>Amount</th>
        <th>Days</th>
        <th>Daily</th>
        <th>CMD</th>
      </tr>
    </thead>
    <tbody :class="$style.fakeRow">
      <MaterialRow :upkeep="fakeUpkeep" />
    </tbody>
    <UpkeepSection
      v-for="site in sites"
      :key="site.siteId"
      :site="site"
      :can-minimize="sites && sites.length > 1"
      :upkeeps="upkeeps[site.siteId]" />
  </table>
</template>

<style module>
.expand {
  text-align: center;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  padding-left: 18px;
  font-weight: bold;
}

.fakeRow {
  visibility: collapse;
}
</style>
