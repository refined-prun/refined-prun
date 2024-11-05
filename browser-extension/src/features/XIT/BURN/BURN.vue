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
import { getPlanetBurn, MaterialBurn } from '@src/core/burn';
import { comparePlanets } from '@src/util';
import BurnSection from '@src/features/XIT/BURN/BurnSection.vue';
import { useTileState } from '@src/features/XIT/BURN/tile-state';
import Tooltip from '@src/components/Tooltip.vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import MaterialRow from '@src/features/XIT/BURN/MaterialRow.vue';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { useXitParameters } from '@src/hooks/useXitParameters';
import { isDefined, isEmpty } from 'ts-extras';

const parameters = useXitParameters();
const isBurnAll = isEmpty(parameters) || parameters[0].toLowerCase() == 'all';

const sites = computed(() => {
  if (isBurnAll) {
    return sitesStore.all.value;
  }

  return parameters.map(x => sitesStore.getByPlanetNaturalIdOrName(x)).filter(isDefined);
});

const planetBurn = computed(() => {
  const filtered = sites.value!.map(getPlanetBurn).filter(isDefined);
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

const red = useTileState('red');
const yellow = useTileState('yellow');
const green = useTileState('green');
const inf = useTileState('inf');

const fakeBurn: MaterialBurn = {
  DailyAmount: -100000,
  DaysLeft: 10,
  Inventory: 100000,
  Type: 'input',
  input: 100000,
  output: 0,
  workforce: 0,
};

const rat = materialsStore.getByTicker('RAT');
</script>

<template>
  <LoadingSpinner v-if="sites === undefined" />
  <template v-else>
    <div :class="PrunCss.ComExOrdersPanel.filter">
      <FilterButton v-model="red">RED</FilterButton>
      <FilterButton v-model="yellow">YELLOW</FilterButton>
      <FilterButton v-model="green">GREEN</FilterButton>
      <FilterButton v-model="inf">INF</FilterButton>
    </div>
    <table>
      <thead>
        <tr>
          <th />
          <th>Inv</th>
          <th>
            <div :class="$style.header">
              Burn
              <Tooltip position="right" tooltip="How much of a material is consumed per day" />
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
          <th>CMD</th>
        </tr>
      </thead>
      <tbody :class="$style.fakeRow">
        <MaterialRow :burn="fakeBurn" :material="rat" />
      </tbody>
      <BurnSection
        v-for="burn in planetBurn"
        :key="burn.planetName"
        :can-minimize="sites.length > 1"
        :burn="burn" />
    </table>
  </template>
</template>

<style module>
.fakeRow {
  visibility: collapse;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
