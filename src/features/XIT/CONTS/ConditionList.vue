<script setup lang="ts">
import ConditionItem from '@src/features/XIT/CONTS/ConditionItem.vue';
import { isConditionFulfilled } from '@src/features/XIT/CONTS/utils';

const props = defineProps({
  conditions: {
    type: Array<PrunApi.ContractCondition>,
    required: true,
  },
});

const filtered = computed(() => {
  return props.conditions
    .slice()
    .sort((a, b) => a.index - b.index)
    .filter(x => x.type !== 'LOAN_INSTALLMENT');
});
const loanInstallments = computed(() =>
  props.conditions.filter(x => x.type === 'LOAN_INSTALLMENT'),
);
const loanTotal = computed(() => loanInstallments.value.length);
const loanFilled = computed(() => loanInstallments.value.filter(isConditionFulfilled).length);
</script>

<template>
  <ConditionItem v-for="condition in filtered" :key="condition.id" :condition="condition" />
  <div v-if="loanTotal !== 0">{{ loanFilled }}/{{ loanTotal }} Loan Installment</div>
</template>
