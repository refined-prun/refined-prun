<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import { fulfillCondition, isFulfillable } from '@src/features/XIT/CONTC/fulfill-condition';

const { contract, condition } = defineProps<{
  contract: PrunApi.Contract;
  condition: PrunApi.ContractCondition;
}>();

const fulfilling = ref(false);
const error = ref<string>();

async function onClick() {
  if (fulfilling.value) {
    return;
  }
  error.value = undefined;
  fulfilling.value = true;
  try {
    const result = await fulfillCondition(contract, condition);
    if (!result.success) {
      error.value = result.error;
    }
  } finally {
    fulfilling.value = false;
  }
}
</script>

<template>
  <PrunButton
    v-if="isFulfillable(condition) && contract.status !== 'OPEN'"
    :class="[$style.button, error ? $style.error : undefined]"
    :success="!error"
    :danger="!!error"
    inline
    :disabled="fulfilling"
    :data-tooltip="error"
    :data-tooltip-position="error ? 'left' : undefined"
    @click="onClick">
    fulfill
  </PrunButton>
</template>

<style module>
.button {
  margin-left: 4px;
}

.error {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 3px,
    rgba(0, 0, 0, 0.25) 3px,
    rgba(0, 0, 0, 0.25) 6px
  );
}
</style>
