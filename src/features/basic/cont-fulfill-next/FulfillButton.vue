<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import { isFulfillable } from '@src/core/contract-conditions';

const { contractId } = defineProps<{
  contractId: string;
  onClick: () => void;
}>();

const contract = computed(() => contractsStore.getByLocalId(contractId));
const isVisible = computed(
  () => contract.value?.status === 'CLOSED' || contract.value?.status === 'PARTIALLY_FULFILLED',
);
const count = computed(
  () => contract.value?.conditions.filter(x => isFulfillable(contract.value, x)).length ?? 0,
);
</script>

<template>
  <PrunButton
    v-if="isVisible"
    success
    :class="$style.button"
    :disabled="count === 0"
    @click="onClick">
    {{ L.ContractCondition.fulfill() }} <span v-if="count > 0">({{ count }})</span>
  </PrunButton>
</template>

<style module>
.button {
  margin-left: 20px;
}
</style>
