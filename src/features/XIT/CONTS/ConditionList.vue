<script setup lang="ts">
import ConditionItem from '@src/features/XIT/CONTS/ConditionItem.vue';
import { isConditionFulfilled } from '@src/features/XIT/CONTS/utils';

const { conditions } = defineProps<{ conditions: PrunApi.ContractCondition[] }>();

const filtered = computed(() => {
  return conditions
    .slice()
    .sort((a, b) => a.index - b.index)
    .filter(x => x.type !== 'LOAN_INSTALLMENT');
});
const loanInstallments = computed(() => conditions.filter(x => x.type === 'LOAN_INSTALLMENT'));
const loanTotal = computed(() => loanInstallments.value.length);
const loanFilled = computed(() => loanInstallments.value.filter(isConditionFulfilled).length);
</script>

<template>
  <ConditionItem v-for="condition in filtered" :key="condition.id" :condition="condition" />
  <div v-if="loanTotal !== 0">{{ loanFilled }}/{{ loanTotal }} Loan Installment</div>
</template>
