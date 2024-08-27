<script lang="ts">
import xit from './xit-registry';
import HQUC from '@src/XIT/HQUC.vue';

xit.add({
  command: ['HQUC'],
  name: 'HQ UPGRADE CALCULATOR',
  component: () => HQUC,
});

export default {};
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { calculateHQUpgradeMaterials, maxHQLevel } from '@src/core/hq';
import { cxStore, getPrice } from '@src/fio/cx';
import MaterialIcon from '@src/components/MaterialIcon.vue';
import { settings } from '@src/store/settings';
import { fixed0, fixed2 } from '@src/utils/format';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import PrunLink from '@src/components/PrunLink.vue';
import { materialsStore } from '@src/prun-api/data/materials';
import { companyStore } from '@src/prun-api/data/company';

const from = ref(companyStore.headquarters.level);
const to = ref(from.value + 1);

const materials = computed(() => calculateHQUpgradeMaterials(from.value, to.value));

function calculateTotal(fn: (material: [number, string]) => number) {
  let total = 0;
  for (const material of materials.value) {
    total += fn(material);
  }
  return total;
}

function formatPrice(price: number): string {
  return settings.fin.currency + fixed0(price);
}

function calculateCost(materialAmount: [number, string]) {
  return getPrice(materialAmount[1]) * materialAmount[0];
}

function calculateWeight(materialAmount: [number, string]) {
  const material = materialsStore.getByTicker(materialAmount[1]);
  return (material?.weight ?? 0) * materialAmount[0];
}

function calculateVolume(materialAmount: [number, string]) {
  const material = materialsStore.getByTicker(materialAmount[1]);
  return (material?.volume ?? 0) * materialAmount[0];
}
</script>

<template>
  <LoadingSpinner v-if="!cxStore.fetched" />
  <div v-else :class="$style.container">
    <div :class="$style.selectors">
      <span>From: </span>
      <select v-model="from">
        <option v-for="i in maxHQLevel" :key="i">{{ i }}</option>
      </select>
      <span> To: </span>
      <select v-model="to">
        <option v-for="i in maxHQLevel" :key="i">{{ i }}</option>
      </select>
    </div>
    <table>
      <thead>
        <tr>
          <th>Material</th>
          <th>Cost</th>
          <th>Weight</th>
          <th>Volume</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="material in materials" :key="material[1]">
          <td><MaterialIcon small :ticker="material[1]" :amount="material[0]" /></td>
          <td>{{ formatPrice(calculateCost(material)) }}</td>
          <td>{{ fixed2(calculateWeight(material)) }}t</td>
          <td>{{ fixed2(calculateVolume(material)) }}m³</td>
          <td><PrunLink :command="`CXM ${material[1]}`" /></td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td>Total:</td>
          <td>{{ formatPrice(calculateTotal(calculateCost)) }}</td>
          <td>{{ fixed2(calculateTotal(calculateWeight)) }}t</td>
          <td>{{ fixed2(calculateTotal(calculateVolume)) }}m³</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
tr > *:first-child {
  width: 0;
}
</style>

<style module>
.container {
  padding-top: 4px;
}

.selectors {
  padding-left: 4px;
}
</style>
