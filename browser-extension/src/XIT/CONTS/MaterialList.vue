<script setup lang="ts">
import { computed, PropType } from 'vue';
import { isPartnerCondition } from '@src/XIT/CONTS/utils';
import ShipmentIcon from '@src/components/ShipmentIcon.vue';
import MaterialIcon from '@src/components/MaterialIcon.vue';

const props = defineProps({
  contract: {
    type: Object as PropType<PrunApi.Contract>,
    required: true,
  },
});

interface ShipmentIconProps {
  type: 'SHIPMENT';
  contractId: string;
}

interface MaterialIconProps {
  type: 'MATERIAL';
  ticker: string;
  amount: number;
}

const icons = computed(() => {
  const result: (ShipmentIconProps | MaterialIconProps)[] = [];
  for (const condition of props.contract.conditions) {
    switch (condition.type) {
      case 'PROVISION_SHIPMENT': {
        if (isPartnerCondition(props.contract, condition)) {
          result.push({ type: 'SHIPMENT', contractId: props.contract.id });
          continue;
        }
        break;
      }
      case 'PROVISION':
      case 'PICKUP_SHIPMENT': {
        continue;
      }
    }

    const quantity = condition.quantity;
    if (!quantity?.material) {
      continue;
    }

    const amount = quantity.amount;
    const ticker = quantity.material.ticker;
    result.push({ type: 'MATERIAL', ticker: ticker, amount: amount });
  }
  return result;
});
</script>

<template>
  <div>
    <template v-for="(icon, i) in icons" :key="i">
      <div v-if="icon.type === 'SHIPMENT'" :style="{ marginBottom: '4px' }">
        <ShipmentIcon small :contract-id="icon.contractId" />
      </div>
      <div v-if="icon.type === 'MATERIAL'" :style="{ marginBottom: '4px' }">
        <MaterialIcon small :ticker="icon.ticker" :amount="icon.amount" />
      </div>
    </template>
  </div>
</template>

<style scoped></style>
