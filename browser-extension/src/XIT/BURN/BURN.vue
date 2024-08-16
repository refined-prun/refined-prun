<script lang="ts">
import xit from '@src/XIT/xit-registry';
import features from '@src/feature-registry';
import BURN from '@src/XIT/BURN/BURN.vue';

function init() {
  xit.add({
    command: 'BURN',
    name: parameters => {
      if (parameters[1] && !parameters[2]) {
        return `ENHANCED BURN - ${parameters[1].toUpperCase()}`;
      }

      return 'ENHANCED BURN';
    },
    vueComponent: BURN,
  });
}

features.add({
  id: 'xit-burn',
  init,
});

export default {};
</script>

<script setup lang="ts">
import SettingsButton from '@src/XIT/BURN/SettingsButton.vue';
import { _$ } from '@src/utils/get-element-by-class-name';
import PrunCss from '@src/prun-ui/prun-css';
import { settings } from '@src/store/settings';
import { computed } from 'vue';
import { sitesStore } from '@src/prun-api/data/sites';
import { getPlanetBurn, PlanetBurn } from '@src/burn';
import { comparePlanets } from '@src/util';
import BurnSection from '@src/XIT/BURN/BurnSection.vue';

const props = defineProps({
  parameters: {
    type: Array<string>,
    required: true,
  },
});

const sites = computed(() => {
  const parameters = props.parameters;
  if (parameters.length === 1 || parameters[1].toLowerCase() == 'all') {
    return sitesStore.all.value;
  }

  return parameters
    .slice(1)
    .map(x => sitesStore.getByPlanetNaturalIdOrName(x))
    .filter(x => x)
    .map(x => x!);
});

const planetBurn = computed(() => {
  const burn = sites.value.map(getPlanetBurn);
  const filtered = burn.filter((x): x is PlanetBurn => x !== undefined);
  if (filtered.length <= 1) {
    return filtered;
  }

  filtered.sort((a, b) => comparePlanets(a.planetName, b.planetName));

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

  filtered.push({ burn: overallBurn, planetName: 'Overall' });

  return filtered;
});

const screenNameElem = _$(PrunCss.ScreenControls.currentScreenName);
const screenName = screenNameElem ? screenNameElem.textContent : '';

const bufferName = screenName + props.parameters.join('');

const dispSettings = computed(() => {
  const result = settings.burn.buffers[bufferName] || {
    red: true,
    yellow: true,
    green: true,
    inf: true,
    minimized: {},
  };
  settings.burn.buffers[bufferName] = result;
  return result;
});

const isMultiplanet = computed(
  () => props.parameters.length > 2 || props.parameters[1].toLowerCase() == 'all',
);

function onRedClick() {
  dispSettings.value.red = !dispSettings.value.red;
  // setSettings(pmmgSettings);
}

function onYellowClick() {
  dispSettings.value.yellow = !dispSettings.value.yellow;
  // setSettings(pmmgSettings);
}

function onGreenClick() {
  dispSettings.value.green = !dispSettings.value.green;
  //setSettings(pmmgSettings);
}

function onInfClick() {
  dispSettings.value.inf = !dispSettings.value.inf;
  //setSettings(pmmgSettings);
}
</script>

<template>
  <div :style="{ paddingTop: '4px' }">
    <div :style="{ display: 'flex' }">
      <SettingsButton
        text="RED"
        :width="22.025"
        :toggled="dispSettings.red"
        :on-click="onRedClick" />
      <SettingsButton
        text="YELLOW"
        :width="40.483"
        :toggled="dispSettings.yellow"
        :on-click="onYellowClick" />
      <SettingsButton
        text="GREEN"
        :width="34.65"
        :toggled="dispSettings.green"
        :on-click="onGreenClick" />
      <SettingsButton
        text="INF"
        :width="19.6"
        :toggled="dispSettings.inf"
        :on-click="onInfClick" />
    </div>
    <table>
      <thead>
        <tr>
          <th colSpan="2"> Needs </th>
          <th>Production</th>
          <th>Inv</th>
          <th>Needed</th>
          <th>Days</th>
        </tr>
      </thead>
      <BurnSection
        v-for="burn in planetBurn"
        :key="burn.planetName"
        :is-multiplanet="isMultiplanet"
        :burn="burn"
        :disp-settings="dispSettings" />
    </table>
  </div>
</template>

<style scoped></style>
