<script setup lang="ts">
import ContractLink from '@src/features/XIT/CONTS/ContractLink.vue';
import MaterialList from '@src/features/XIT/CONTS/MaterialList.vue';
import PartnerLink from '@src/features/XIT/CONTS/PartnerLink.vue';
import ConditionList from '@src/features/XIT/CONTS/ConditionList.vue';
import { isPartnerCondition, isSelfCondition } from '@src/features/XIT/CONTS/utils';

const props = defineProps({
  contract: {
    type: Object as PropType<PrunApi.Contract>,
    required: true,
  },
});

const self = computed(() =>
  props.contract.conditions.filter(x => isSelfCondition(props.contract, x)),
);
const partner = computed(() =>
  props.contract.conditions.filter(x => isPartnerCondition(props.contract, x)),
);
</script>

<template>
  <tr>
    <td>
      <ContractLink :contract="contract" />
    </td>
    <td :style="{ width: '32px', paddingLeft: '10px' }">
      <MaterialList :contract="contract" />
    </td>
    <td>
      <PartnerLink :contract="contract" />
      <ConditionList :conditions="partner" />
    </td>
    <td>
      <ConditionList :conditions="self" />
    </td>
  </tr>
</template>
