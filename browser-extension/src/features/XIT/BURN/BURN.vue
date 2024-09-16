<script lang="ts">
import xit from '@src/features/XIT/xit-registry';
import BURN from '@src/features/XIT/BURN/BURN.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';

xit.add({
  command: 'BURN',
  name: parameters => {
    if (parameters[1] && !parameters[2]) {
      const site = sitesStore.getByPlanetNaturalIdOrName(parameters[1]);
      if (site) {
        const name = getEntityNameFromAddress(site.address);
        return `ENHANCED BURN - ${name}`;
      }
    }

    return 'ENHANCED BURN';
  },
  component: () => BURN,
});

export default {};
</script>

<script setup lang="ts">
import FilterButton from '@src/features/XIT/BURN/FilterButton.vue';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { computed } from 'vue';
import { getPlanetBurn, PlanetBurn } from '@src/core/burn';
import { comparePlanets } from '@src/util';
import BurnSection from '@src/features/XIT/BURN/BurnSection.vue';
import { useTileState } from '@src/features/XIT/BURN/tile-state';
import Tooltip from '@src/components/Tooltip.vue';

const props = defineProps({
  parameters: {
    type: Array<string>,
    required: true,
  },
});

const isBurnAll = computed(
  () => props.parameters.length === 1 || props.parameters[1].toLowerCase() == 'all',
);

const sites = computed(() => {
  if (isBurnAll.value) {
    return sitesStore.all.value;
  }

  return props.parameters
    .slice(1)
    .map(x => sitesStore.getByPlanetNaturalIdOrName(x)!)
    .filter(x => x);
});

const planetBurn = computed(() => {
  const burn = sites.value.map(getPlanetBurn);
  const filtered = burn.filter((x): x is PlanetBurn => x !== undefined);
  if (filtered.length <= 1) {
    return filtered;
  }

  filtered.sort((a, b) => comparePlanets(a.naturalId, b.naturalId));

  const overallBurn = {};
  for (const burn of filtered) {
    for (const mat of Object.keys(burn.burn)) {
      if (overallBurn[mat]) {
        overallBurn[mat].DailyAmount += burn.burn[mat].DailyAmount;
        overallBurn[mat].Inventory += burn.burn[mat].Inventory;
      } else {
        overallBurn[mat] = {};
        overallBurn[mat].DailyAmount = burn.burn[mat].DailyAmount;
        overallBurn[mat].Inventory = burn.burn[mat].Inventory;
      }
    }
  }

  for (const mat of Object.keys(overallBurn)) {
    if (overallBurn[mat].DailyAmount >= 0) {
      overallBurn[mat].DaysLeft = 1000;
    } else {
      overallBurn[mat].DaysLeft = -overallBurn[mat].Inventory / overallBurn[mat].DailyAmount;
    }
  }

  filtered.push({ burn: overallBurn, planetName: 'Overall', naturalId: '', storeId: '' });
  return filtered;
});

const isMultiplanet = computed(() => sites.value.length > 1);

const red = useTileState('red');
const yellow = useTileState('yellow');
const green = useTileState('green');
const inf = useTileState('inf');
</script>

<template>
  <div :class="PrunCss.ComExOrdersPanel.filter">
    <FilterButton v-model="red">RED</FilterButton>
    <FilterButton v-model="yellow">YELLOW</FilterButton>
    <FilterButton v-model="green">GREEN</FilterButton>
    <FilterButton v-model="inf">INF</FilterButton>
  </div>
  <table>
    <thead>
      <tr>
        <th>Material</th>
        <th>
          <div :class="$style.header">
            Burn
            <Tooltip
              position="bottom"
              tooltip="How much of a material is consumed per day. Positive amount means production." />
          </div>
        </th>
        <th>
          <div :class="$style.header">
            Need
            <Tooltip
              position="bottom"
              tooltip="How much of a material needs to be delivered to be fully resupplied" />
          </div>
        </th>
        <th>Days</th>
        <th>Load</th>
        <th>Cost</th>
        <th>CMD</th>
      </tr>
    </thead>
    <BurnSection
      v-for="burn in planetBurn"
      :key="burn.planetName"
      :is-multiplanet="isMultiplanet"
      :burn="burn" />
  </table>
</template>

<style module>
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
