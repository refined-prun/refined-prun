<script setup lang="ts">
import { fixed02 } from '@src/utils/format';
import AddressLink from '@src/features/XIT/CONTC/AddressLink.vue';
import PrunLink from '@src/components/PrunLink.vue';

defineProps<{ condition: PrunApi.ContractCondition }>();
</script>

<template>
  <template v-if="condition.type === 'PAYMENT'">
    Pay {{ fixed02(condition.amount!.amount) }} {{ condition.amount!.currency }}
  </template>
  <template v-else-if="condition.type === 'LOAN_PAYOUT'">
    Pay {{ fixed02(condition.amount!.amount) }} {{ condition.amount!.currency }}
  </template>
  <template v-else-if="condition.type === 'LOAN_INSTALLMENT'">
    Pay {{ fixed02(condition.repayment!.amount + condition.interest!.amount) }}
    {{ condition.repayment!.currency }} (auto)
  </template>
  <template v-else-if="condition.type === 'DELIVERY_SHIPMENT'">
    Deliver SHPT @
    <AddressLink :address="condition.destination!" />
  </template>
  <template v-else-if="condition.type === 'DELIVERY'">
    Deliver {{ condition.quantity!.amount }} {{ condition.quantity!.material.ticker }} @
    <AddressLink :address="condition.address!" />
  </template>
  <template v-else-if="condition.type === 'PICKUP_SHIPMENT'">
    Pick up SHPT @
    <AddressLink :address="condition.address!" />
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
    Explore
    <AddressLink :address="condition.address!" />
  </template>
  <template v-else-if="condition.type === 'COMEX_PURCHASE_PICKUP'">
    Pick up {{ condition.quantity!.amount - condition.pickedUp!.amount }}
    {{ condition.quantity!.material.ticker }} @
    <AddressLink :address="condition.address!" />
  </template>
  <template v-else-if="condition.type === 'HEADQUARTERS_UPGRADE'">Upgrade HQ</template>
  <template v-else-if="condition.type === 'BASE_CONSTRUCTION'">Construct Base</template>
  <template v-else-if="condition.type === 'FINISH_FLIGHT'">Finish Flight</template>
  <template v-else-if="condition.type === 'PLACE_ORDER'">Place Order</template>
  <template v-else-if="condition.type === 'PRODUCTION_ORDER_COMPLETED'">
    Complete Production Order
  </template>
  <template v-else-if="condition.type === 'PRODUCTION_RUN'">Run Production</template>
  <template v-else-if="condition.type === 'START_FLIGHT'">Start Flight</template>
  <template v-else-if="condition.type === 'POWER'">Become Governor</template>
  <template v-else-if="condition.type === 'REPAIR_SHIP'">Repair Ship</template>
  <template v-else-if="condition.type === 'CONTRIBUTION'">Contribution</template>
  <template v-else-if="condition.type === 'CONSTRUCT_SHIP'">Construct Ship</template>
  <template v-else-if="condition.type === 'GATEWAY_FUEL'">
    Refuel
    <PrunLink inline :command="`GTW ${condition.gatewayId?.naturalId}`">{{
      condition.gatewayId?.name
    }}</PrunLink>
  </template>
  <template v-else-if="condition.type === 'INFRASTRUCTURE_CONSTRUCTION_FINISH'">
    Finish Building Infrastructure
  </template>
  <template v-else-if="condition.type === 'INFRASTRUCTURE_CONSTRUCTION_START'">
    Start Building Infrastructure
  </template>
  <template v-else-if="condition.type === 'INFRASTRUCTURE_UPGRADE_FINISH'">
    Finish Upgrading Infrastructure
  </template>
  <template v-else-if="condition.type === 'INFRASTRUCTURE_UPGRADE_START'">
    Start Upgrading Infrastructure
  </template>
  <template v-else-if="condition.type === 'INFRASTRUCTURE_UPKEEP'">
    Upkeep
    <PrunLink inline :command="`INFU ${condition.infrastructureId?.naturalId}`">{{
      condition.infrastructureId?.name
    }}</PrunLink>
  </template>
  <template v-else-if="condition.type === 'PICKUP'">Pickup</template>
  <template v-else-if="condition.type === 'WORKFORCE_PROGRAM_PAYMENT'">
    Pay {{ fixed02(condition.amount!.amount) }} {{ condition.amount!.currency }}
  </template>
  <template v-else>
    {{ condition.type }}
  </template>
</template>
