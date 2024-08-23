<script lang="ts">
import xit from '@src/XIT/xit-registry';
import features from '@src/feature-registry';
import HEALTH from '@src/XIT/HEALTH.vue';

function init() {
  xit.add({
    command: 'HEALTH',
    name: 'DATA HEALTH',
    vueComponent: HEALTH,
  });
}

features.add({
  id: 'xit-health',
  init,
});

export default {};
</script>

<script setup lang="ts">
import { sitesStore } from '@src/prun-api/data/sites';
import { getPlanetNameFromAddress } from '@src/prun-api/data/addresses';
import { workforcesStore } from '@src/prun-api/data/workforces';
import { productionStore } from '@src/prun-api/data/production';
import { storagesStore } from '@src/prun-api/data/storage';
import { warehousesStore } from '@src/prun-api/data/warehouses';
import { contractsStore } from '@src/prun-api/data/contracts';
import { cxosStore } from '@src/prun-api/data/cxos';
import { fxosStore } from '@src/prun-api/data/fxos';
import { balancesStore } from '@src/prun-api/data/balances';
import { cxStore } from '@src/fio/cx';
import { computed } from 'vue';
import PrunCss from '@src/prun-ui/prun-css';

const bases = computed(() => {
  return sitesStore.all.value.map(site => ({
    name: getPlanetNameFromAddress(site.address)!,
    workforce: !!workforcesStore.getById(site.siteId),
    production: !!productionStore.getBySiteId(site.siteId),
    storage: !!storagesStore.getByAddress(site.siteId),
  }));
});

const otherData = computed(() => [
  ['Base Sites', sitesStore.all.value.length],
  ['Warehouse Sites', warehousesStore.all.value.length],
  ['Base Stores', storagesStore.all.value.filter(x => x.type === 'STORE').length],
  ['Warehouse Stores', storagesStore.all.value.filter(x => x.type === 'WAREHOUSE_STORE').length],
  ['Ship Stores', storagesStore.all.value.filter(x => x.type === 'SHIP_STORE').length],
  ['Workforces', workforcesStore.all.value.length],
  ['Production Sites', productionStore.all.value.length],
  ['Contracts', contractsStore.all.value.length],
  ['CXOS', cxosStore.all.value.length],
  ['FXOS', fxosStore.all.value.length],
  ['Currency', balancesStore.all.value.length > 0],
  [
    'CX Price Age',
    cxStore.prices ? `${((Date.now() - cxStore.age) / 3600000).toFixed(0)}h` : false,
  ],
]);

const positive = PrunCss.ColoredValue.positive;
const negative = PrunCss.ColoredValue.negative;
</script>

<template>
  <div :style="{ paddingTop: '4px' }">
    <span class="title">Bases</span>
    <table>
      <thead>
        <tr>
          <th>Planet</th>
          <th>Workforce</th>
          <th>Production</th>
          <th>Storage</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="base in bases" :key="base.name">
          <td>{{ base.name }}</td>
          <td v-if="base.workforce" :class="positive">✓</td>
          <td v-else :class="negative">✗</td>
          <td v-if="base.production" :class="positive">✓</td>
          <td v-else :class="negative">✗</td>
          <td v-if="base.storage" :class="positive">✓</td>
          <td v-else :class="negative">✗</td>
        </tr>
      </tbody>
    </table>
    <span class="title" style="padding-top: 10px">Other Data</span>
    <table>
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(other, i) in otherData" :key="i">
          <td>{{ other[0] }}</td>
          <td>
            <span v-if="other[1] === true" :class="positive">✓</span>
            <span v-else-if="other[1] === false" :class="negative">✗</span>
            <template v-else>{{ other[1] }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
