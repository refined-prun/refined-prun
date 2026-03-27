<script setup lang="ts">
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import { getDestinationName } from '@src/infrastructure/prun-api/data/addresses';
import { sumBy } from '@src/utils/sum-by';
import { getStoreName } from '@src/features/XIT/SHPT/store-name';
import ShipmentGroup from '@src/features/XIT/SHPT/ShipmentGroup.vue';
import TransferPanel from '@src/features/XIT/SHPT/TransferPanel.vue';
import { ShipmentItem, ContractSubgroup, ShipmentGroupData } from '@src/features/XIT/SHPT/types';

interface StoreGroup {
  storeName: string;
  storeId: string;
  groups: ShipmentGroupData[];
  totalItems: number;
}

const loaded = computed(() => storagesStore.fetched.value && contractsStore.fetched.value);

const storeGroups = computed<StoreGroup[]>(() => {
  const stores = storagesStore.all.value;
  if (!stores) {
    return [];
  }

  const result: StoreGroup[] = [];

  for (const store of stores) {
    const shipmentItems = store.items.filter(x => x.type === 'SHIPMENT');
    if (shipmentItems.length === 0) {
      continue;
    }

    // Group by destination.
    const byDest = new Map<string, ShipmentItem[]>();
    for (const item of shipmentItems) {
      const destination = contractsStore.getDestinationByShipmentId(item.id);
      const destName = getDestinationName(destination) ?? 'Unknown';
      let group = byDest.get(destName);
      if (!group) {
        group = [];
        byDest.set(destName, group);
      }

      const contract = contractsStore.getByShipmentId(item.id);
      group.push({
        id: item.id,
        weight: item.weight,
        volume: item.volume,
        destination: destName,
        contractId: contract?.localId ?? '',
      });
    }

    const groups: ShipmentGroupData[] = [];
    for (const [destination, items] of byDest) {
      // Sub-group by contract.
      const byContract = new Map<string, ShipmentItem[]>();
      for (const item of items) {
        const key = item.contractId || 'unknown';
        let list = byContract.get(key);
        if (!list) {
          list = [];
          byContract.set(key, list);
        }
        list.push(item);
      }
      const contracts: ContractSubgroup[] = [];
      for (const [contractId, contractItems] of byContract) {
        contracts.push({
          contractId,
          items: contractItems,
          totalWeight: sumBy(contractItems, x => x.weight),
          totalVolume: sumBy(contractItems, x => x.volume),
        });
      }
      groups.push({
        destination,
        contracts,
        totalWeight: sumBy(items, x => x.weight),
        totalVolume: sumBy(items, x => x.volume),
        totalItems: items.length,
      });
    }
    groups.sort((a, b) => a.destination.localeCompare(b.destination));

    result.push({
      storeName: getStoreName(store),
      storeId: store.id,
      groups,
      totalItems: shipmentItems.length,
    });
  }

  return result.filter(x => x.groups.length > 0);
});

const hasShipments = computed(() => storeGroups.value.length > 0);
</script>

<template>
  <LoadingSpinner v-if="!loaded" />
  <template v-else-if="!hasShipments">
    <SectionHeader>No shipments found</SectionHeader>
  </template>
  <template v-else>
    <TransferPanel />
    <template v-for="store in storeGroups" :key="store.storeId">
      <SectionHeader>{{ store.storeName }} ({{ store.totalItems }} shipments)</SectionHeader>
      <table>
        <thead>
          <tr>
            <th>Destination</th>
            <th>Count</th>
            <th>Weight</th>
            <th>Volume</th>
            <th>Contract</th>
          </tr>
        </thead>
        <ShipmentGroup v-for="group in store.groups" :key="group.destination" :group="group" />
      </table>
    </template>
  </template>
</template>
