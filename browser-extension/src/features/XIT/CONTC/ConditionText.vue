<script setup lang="ts">
import { PropType } from 'vue';
import { fixed0 } from '@src/utils/format';
import AddressLink from '@src/features/XIT/CONTC/AddressLink.vue';

defineProps({
  condition: {
    type: Object as PropType<PrunApi.ContractCondition>,
    required: true,
  },
});
</script>

<template>
  <template v-if="condition.type === 'PAYMENT'">
    Pay {{ fixed0(condition.amount!.amount) }} {{ condition.amount!.currency }}
  </template>
  <template v-else-if="condition.type === 'LOAN_PAYOUT'">
    Pay {{ fixed0(condition.amount!.amount) }} {{ condition.amount!.currency }}
  </template>
  <template v-else-if="condition.type === 'LOAN_INSTALLMENT'">
    Pay {{ fixed0(condition.repayment!.amount + condition.interest!.amount) }}
    {{ condition.repayment!.currency }} (auto)
  </template>
  <template v-else-if="condition.type === 'DELIVERY_SHIPMENT'">
    Deliver SHPT @ <AddressLink :address="condition.destination!" />
  </template>
  <template v-else-if="condition.type === 'DELIVERY'">
    Deliver {{ condition.quantity!.amount }} {{ condition.quantity!.material.ticker }} @
    <AddressLink :address="condition.address!" />
  </template>
  <template v-else-if="condition.type === 'PICKUP_SHIPMENT'">
    Pick up SHPT @ <AddressLink :address="condition.address!" />
  </template>
  <template v-else-if="condition.type === 'PROVISION_SHIPMENT'">
    Provision {{ condition.quantity!.amount }} {{ condition.quantity!.material.ticker }} @
    <AddressLink :address="condition.address!" />
  </template>
  <template v-else-if="condition.type === 'PROVISION'">
    Provision {{ condition.quantity!.amount }} {{ condition.quantity!.material.ticker }} @
    <AddressLink :address="condition.address!" />
  </template>
  <template v-else-if="condition.type === 'EXPLORATION'">
    Explore <AddressLink :address="condition.address!" />
  </template>
  <template v-else-if="condition.type === 'COMEX_PURCHASE_PICKUP'">
    Pick up {{ condition.quantity!.amount }} {{ condition.quantity!.material.ticker }} @
    <AddressLink :address="condition.address!" />
  </template>
  <template v-else>
    {{ condition.type }}
  </template>
</template>
