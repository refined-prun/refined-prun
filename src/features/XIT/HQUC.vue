<script setup lang="ts">
import { calculateHQUpgradeMaterials } from '@src/core/hq';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import MaterialPurchaseTable from '@src/components/MaterialPurchaseTable.vue';
import { useTileState } from '@src/store/user-data-tiles';
import PrunButton from '@src/components/PrunButton.vue';
import Active from '@src/components/forms/Active.vue';
import Commands from '@src/components/forms/Commands.vue';
import NumberInput from '@src/components/forms/NumberInput.vue';

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
      <NumberInput v-model="from" />
    </Active>
    <Active label="To">
      <NumberInput v-model="to" />
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
