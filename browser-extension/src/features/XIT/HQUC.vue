<script lang="ts">
import xit from './xit-registry';
import HQUC from '@src/features/XIT/HQUC.vue';

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
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import MaterialPurchaseTable from '@src/components/MaterialPurchaseTable.vue';

const from = ref(companyStore.value?.headquarters.level ?? 1);
const to = ref(from.value + 1);

const materials = computed(() => calculateHQUpgradeMaterials(from.value, to.value));
</script>

<template>
  <div :class="$style.container">
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
