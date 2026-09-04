<script setup lang="ts">
import { fixed02 } from '@src/utils/format';
import AddressLink from '@src/features/XIT/CONTC/AddressLink.vue';
import PrunLink from '@src/components/PrunLink.vue';

defineProps<{ condition: PrunApi.ContractCondition }>();
</script>

<template>
  <template v-if="condition.type === 'BASE_CONSTRUCTION'">Set up a base</template>
  <template v-if="condition.type === 'BUILDING_CONSTRUCTION'">Construct a building</template>
  <template v-if="condition.type === 'BUY_MATERIAL_FROM_CATEGORY'">Buy a material</template>
  <template v-else-if="condition.type === 'COMEX_PURCHASE_PICKUP'">
    Pick up {{ condition.quantity!.amount - condition.pickedUp!.amount }}
    {{ condition.quantity!.material.ticker }} @
    <AddressLink :address="condition.address!" />
  </template>
  <template v-else-if="condition.type === 'CONSTRUCT_SHIP'">Construct or modify a ship</template>
  <template v-else-if="condition.type === 'CONTRIBUTION'">
    Contribute @
    <AddressLink :address="condition.address!" />
  </template>
  <template v-else-if="condition.type === 'DELIVERY'">
    Deliver {{ condition.quantity!.amount }} {{ condition.quantity!.material.ticker }} @
    <AddressLink :address="condition.address!" />
  </template>
  <template v-else-if="condition.type === 'DELIVERY_SHIPMENT'">
    Deliver SHPT @
    <AddressLink :address="condition.destination!" />
  </template>
  <template v-else-if="condition.type === 'EXPLORATION'">
    Explore
    <AddressLink :address="condition.address!" />
  </template>
  <template v-else-if="condition.type === 'FINISH_FLIGHT'">Finish a flight</template>
  <template v-else-if="condition.type === 'FULFILL_COUNTRY_CONTRACT'">
    Fulfill a faction contract
  </template>
  <template v-else-if="condition.type === 'GATEWAY_FUEL'">
    Refuel
    <PrunLink inline :command="`GTW ${condition.gatewayId?.naturalId}`">{{
      condition.gatewayId?.name
    }}</PrunLink>
  </template>
  <template v-else-if="condition.type === 'HEADQUARTERS_UPGRADE'">Upgrade HQ</template>
  <template v-else-if="condition.type === 'INCREASE_SATISFACTION'">Increase satisfaction</template>
  <template v-else-if="condition.type === 'INFRASTRUCTURE_CONSTRUCTION_FINISH'">
    Finish building Infrastructure
  </template>
  <template v-else-if="condition.type === 'INFRASTRUCTURE_CONSTRUCTION_START'">
    Start building Infrastructure
  </template>
  <template v-else-if="condition.type === 'INFRASTRUCTURE_UPGRADE_FINISH'">
    Finish upgrading Infrastructure
  </template>
  <template v-else-if="condition.type === 'INFRASTRUCTURE_UPGRADE_START'">
    Start upgrading Infrastructure
  </template>
  <template v-else-if="condition.type === 'INFRASTRUCTURE_UPKEEP'">
    Upkeep
    <PrunLink inline :command="`INFU ${condition.infrastructureId?.naturalId}`">{{
      condition.infrastructureId?.name
    }}</PrunLink>
  </template>
  <template v-else-if="condition.type === 'LOAN_INSTALLMENT'">
    Pay {{ fixed02(condition.repayment!.amount + condition.interest!.amount) }}
    {{ condition.repayment!.currency }} (auto)
  </template>
  <template v-else-if="condition.type === 'LOAN_PAYOUT'">
    Pay {{ fixed02(condition.amount!.amount) }} {{ condition.amount!.currency }}
  </template>
  <template v-else-if="condition.type === 'MAKE_MONEY'">Make money</template>
  <template v-else-if="condition.type === 'PAYMENT'">
    Pay {{ fixed02(condition.amount!.amount) }} {{ condition.amount!.currency }}
  </template>
  <template v-else-if="condition.type === 'PICKUP'">Pickup</template>
  <template v-else-if="condition.type === 'PICKUP_SHIPMENT'">
    Pick up SHPT @
    <AddressLink :address="condition.address!" />
  </template>
  <template v-else-if="condition.type === 'PLACE_ORDER'">Place an order</template>
  <template v-else-if="condition.type === 'POWER'">Become a governor</template>
  <template v-else-if="condition.type === 'PRODUCTION_ORDER_COMPLETED'">
    Complete a production order
  </template>
  <template v-else-if="condition.type === 'PRODUCTION_RUN'">Run production</template>
  <template v-else-if="condition.type === 'PROVISION'">
    Provision {{ condition.quantity!.amount }} {{ condition.quantity!.material.ticker }} @
    <AddressLink :address="condition.address!" />
  </template>
  <template v-else-if="condition.type === 'PROVISION_SHIPMENT'">
    Provision {{ condition.quantity!.amount }} {{ condition.quantity!.material.ticker }} @
    <AddressLink :address="condition.address!" />
  </template>
  <template v-else-if="condition.type === 'REPAIR_SHIP'">Repair a ship</template>
  <template v-else-if="condition.type === 'START_FLIGHT'">Start a flight</template>
  <template v-else-if="condition.type === 'WAIT'">Wait</template>
  <template v-else-if="condition.type === 'WORKFORCE_PROGRAM_PAYMENT'">
    Pay {{ fixed02(condition.amount!.amount) }} {{ condition.amount!.currency }}
  </template>
  <template v-else-if="condition.type === 'WORKFORCE_PROGRAM_START'">
    Start workforce program
  </template>
  <template v-else>
    {{ condition.type }}
  </template>
</template>
