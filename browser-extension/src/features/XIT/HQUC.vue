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
import { computed } from 'vue';
import { calculateHQUpgradeMaterials, maxHQLevel } from '@src/core/hq';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import MaterialPurchaseTable from '@src/components/MaterialPurchaseTable.vue';
import { useTileState } from '@src/store/user-data-tiles';
import PrunButton from '@src/components/PrunButton.vue';
import Active from '@src/components/forms/Active.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import Commands from '@src/components/forms/Commands.vue';

const levels = Array.from({ length: maxHQLevel }, (_, i) => (i + 1).toString());

const from = useTileState('from', companyStore.value?.headquarters.level ?? 1);
const to = useTileState('to', from.value + 1);

const materials = computed(() => calculateHQUpgradeMaterials(from.value, to.value));

function reset() {
  from.value = companyStore.value?.headquarters.level ?? 1;
  to.value = from.value + 1;
}
</script>

<template>
  <form>
    <Active label="From">
      <SelectInput v-model="from" :options="levels" />
    </Active>
    <Active label="To">
      <SelectInput v-model="to" :options="levels" />
    </Active>
    <Commands>
      <PrunButton primary @click="reset">RESET</PrunButton>
    </Commands>
  </form>
  <MaterialPurchaseTable :materials="materials" />
</template>

<style module>
.container {
  padding-top: 4px;
}

.selectors {
  padding-left: 4px;
}
</style>
