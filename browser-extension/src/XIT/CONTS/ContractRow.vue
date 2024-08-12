<script setup lang="ts">
import { computed, PropType } from 'vue';
import ContractLink from '@src/XIT/CONTS/ContractLink.vue';
import MaterialList from '@src/XIT/CONTS/MaterialList.vue';
import PartnerLink from '@src/XIT/CONTS/PartnerLink.vue';
import ConditionList from '@src/XIT/CONTS/ConditionList.vue';
import { isPartnerCondition, isSelfCondition } from '@src/XIT/CONTS/utils';

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
