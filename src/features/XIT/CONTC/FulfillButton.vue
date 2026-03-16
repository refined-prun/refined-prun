<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import { fulfillCondition, isFulfillable } from '@src/features/XIT/CONTC/fulfill-condition';

const { contract, condition } = defineProps<{
  contract: PrunApi.Contract;
  condition: PrunApi.ContractCondition;
}>();

const fulfilling = ref(false);

async function onClick() {
  if (fulfilling.value) {
    return;
  }
  fulfilling.value = true;
  try {
    await fulfillCondition(contract, condition);
  } finally {
    fulfilling.value = false;
  }
}
</script>

<template>
  <PrunButton
    v-if="isFulfillable(condition)"
    success
    inline
    :disabled="fulfilling"
    @click="onClick">
    fulfill
  </PrunButton>
</template>
