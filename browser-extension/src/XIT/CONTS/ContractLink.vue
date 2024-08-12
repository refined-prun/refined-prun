<script setup lang="ts">
import { computed, PropType } from 'vue';
import PrunLink from '@src/components/PrunLink.vue';
import { isFactionContract, isPartnerCondition } from '@src/XIT/CONTS/utils';

const props = defineProps({
  contract: {
    type: Object as PropType<PrunApi.Contract>,
    required: true,
  },
});

const actionMark = computed(() => (isActionable(props.contract) ? '❗' : ''));
const linkStyle = computed(() => ({
  display: isFactionContract(props.contract) ? 'inline' : 'block',
}));

function isActionable(contract: PrunApi.Contract) {
  if (contract.party === 'CUSTOMER' && contract.status === 'OPEN') {
    return true;
  }

  if (contract.status !== 'PARTIALLY_FULFILLED' && contract.status !== 'CLOSED') {
    return;
  }

  const conditionsById: Map<string, PrunApi.ContractCondition> = new Map();
  for (const condition of contract.conditions) {
    conditionsById.set(condition.id, condition);
  }
  for (const condition of contract.conditions) {
    if (isPartnerCondition(contract, condition) || condition.status === 'FULFILLED') {
      continue;
    }

    const hasPendingDependencies = condition.dependencies
      .map(x => conditionsById.get(x))
      .some(x => x && x.status === 'PENDING' && isPartnerCondition(contract, x));
    if (!hasPendingDependencies) {
      return true;
    }
  }

  return false;
}
</script>

<template>
  <PrunLink :command="`CONT ${contract.localId}`" :style="linkStyle">
    {{ actionMark }}{{ contract.name || contract.localId }}
  </PrunLink>
</template>
