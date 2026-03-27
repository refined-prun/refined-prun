<script setup lang="ts">
import PrunLink from '@src/components/PrunLink.vue';
import { fixed2 } from '@src/utils/format';

interface ShipmentItem {
  id: string;
  weight: number;
  volume: number;
  destination: string;
  contractId: string;
}

interface ContractSubgroup {
  contractId: string;
  items: ShipmentItem[];
  totalWeight: number;
  totalVolume: number;
}

interface ShipmentGroupData {
  destination: string;
  contracts: ContractSubgroup[];
  totalWeight: number;
  totalVolume: number;
  totalItems: number;
}

const { group } = defineProps<{ group: ShipmentGroupData }>();

const expanded = ref(false);
const expandedContracts = ref(new Set<string>());

function toggleContract(contractId: string) {
  const next = new Set(expandedContracts.value);
  if (next.has(contractId)) {
    next.delete(contractId);
  } else {
    next.add(contractId);
  }
  expandedContracts.value = next;
}
</script>

<template>
  <tbody>
    <!-- Destination summary row. -->
    <tr :class="$style.destRow" @click="expanded = !expanded">
      <td :class="$style.destination">{{ expanded ? '-' : '+' }} {{ group.destination }}</td>
      <td>{{ group.totalItems }}</td>
      <td>{{ fixed2(group.totalWeight) }}t</td>
      <td>{{ fixed2(group.totalVolume) }}m³</td>
      <td />
    </tr>
    <template v-if="expanded">
      <template v-for="sub in group.contracts" :key="sub.contractId">
        <!-- Contract subtotal row. -->
        <tr :class="$style.contractRow" @click="toggleContract(sub.contractId)">
          <td :class="$style.contractId">
            {{ expandedContracts.has(sub.contractId) ? '-' : '+' }}
            <PrunLink inline :command="`CONT ${sub.contractId}`">{{ sub.contractId }}</PrunLink>
          </td>
          <td>{{ sub.items.length }}</td>
          <td>{{ fixed2(sub.totalWeight) }}t</td>
          <td>{{ fixed2(sub.totalVolume) }}m³</td>
          <td />
        </tr>
        <!-- Individual items. -->
        <template v-if="expandedContracts.has(sub.contractId)">
          <tr v-for="item in sub.items" :key="item.id" :class="$style.itemRow">
            <td :class="$style.itemId">{{ item.id.slice(0, 8) }}</td>
            <td />
            <td>{{ fixed2(item.weight) }}t</td>
            <td>{{ fixed2(item.volume) }}m³</td>
            <td />
          </tr>
        </template>
      </template>
    </template>
  </tbody>
</template>

<style module>
.destRow {
  cursor: pointer;
  user-select: none;
}

.destination {
  font-weight: bold;
}

.contractRow {
  cursor: pointer;
  user-select: none;
}

.contractId {
  padding-left: 14px;
}

.itemRow {
  opacity: 0.7;
}

.itemId {
  padding-left: 28px;
  font-size: 11px;
}
</style>
