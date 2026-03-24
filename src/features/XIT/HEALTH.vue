<script setup lang="ts">
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import { cxosStore } from '@src/infrastructure/prun-api/data/cxos';
import { fxosStore } from '@src/infrastructure/prun-api/data/fxos';
import { balancesStore } from '@src/infrastructure/prun-api/data/balances';
import { cxStore } from '@src/infrastructure/fio/cx';
import { dayjsEachSecond } from '@src/utils/dayjs';
import { objectId } from '@src/utils/object-id';

const bases = computed(() => {
  return (
    sitesStore.all.value?.map(site => ({
      name: getEntityNameFromAddress(site.address)!,
      workforce: !!workforcesStore.getById(site.siteId),
      production: !!productionStore.getBySiteId(site.siteId),
      storage: !!storagesStore.getByAddressableId(site.siteId),
    })) ?? []
  );
});

const otherData = computed(() => [
  ['Base Sites', sitesStore.all.value?.length],
  ['Warehouse Sites', warehousesStore.all.value?.length],
  ['Base Stores', storagesStore.getByType('STORE')?.length],
  ['Warehouse Stores', storagesStore.getByType('WAREHOUSE_STORE')?.length],
  ['Ship Stores', storagesStore.getByType('SHIP_STORE')?.length],
  ['Workforces', workforcesStore.all.value?.length],
  ['Production Sites', productionStore.all.value?.length],
  ['Contracts', contractsStore.all.value?.length],
  ['CXOS', cxosStore.all.value?.length],
  ['FXOS', fxosStore.all.value?.length],
  ['Currency', (balancesStore.all.value?.length ?? 0) > 0],
  ['Last CX Price Update', cxStore.fetched ? `${dayjsEachSecond.value.to(cxStore.age)}` : false],
]);

const positive = C.ColoredValue.positive;
const negative = C.ColoredValue.negative;
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
    <table :style="{ tableLayout: 'fixed' }">
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="other in otherData" :key="objectId(other)">
          <td>{{ other[0] }}</td>
          <td>
            <span v-if="other[1] === true" :class="positive">✓</span>
            <span v-else-if="other[1] === false || other[1] === undefined" :class="negative">
              ✗
            </span>
            <template v-else>{{ other[1] }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
