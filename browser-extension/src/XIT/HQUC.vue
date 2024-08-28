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
import { cxStore } from '@src/fio/cx';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { materialsStore } from '@src/prun-api/data/materials';
import { companyStore } from '@src/prun-api/data/company';
import MaterialPurchaseTable from '@src/components/MaterialPurchaseTable.vue';

const from = ref(companyStore.headquarters.level);
const to = ref(from.value + 1);

const materials = computed(() => {
  const raw = calculateHQUpgradeMaterials(from.value, to.value);
  const materials: PrunApi.MaterialAmount[] = [];
  for (const [amount, ticker] of raw) {
    const material = materialsStore.getByTicker(ticker);
    if (!material) {
      continue;
    }
    materials.push({
      material,
      amount,
    });
  }
  return materials;
});
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
    <MaterialPurchaseTable :materials="materials" />
  </div>
</template>

<style module>
.container {
  padding-top: 4px;
}

.selectors {
  padding-left: 4px;
}
</style>
