<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import PrunButton from '@src/components/PrunButton.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import { getDestinationName } from '@src/infrastructure/prun-api/data/addresses';
import { sumBy } from '@src/utils/sum-by';
import { fixed2 } from '@src/utils/format';
import { getStoreName, getColocatedStores } from '@src/features/XIT/SHPT/store-name';
import { transferItem } from '@src/features/XIT/SHPT/transfer';
import { ShipmentItem } from '@src/features/XIT/SHPT/types';

// Stores that have SHPT items.
const sourceOptions = computed(() => {
  const stores = storagesStore.all.value ?? [];
  return stores
    .filter(x => x.items.some(i => i.type === 'SHIPMENT'))
    .map(x => ({
      label: `${getStoreName(x)} (${x.items.filter(i => i.type === 'SHIPMENT').length})`,
      value: x.id,
    }));
});

const selectedSourceId = ref('');

// Auto-select if only one source.
watchEffect(() => {
  if (sourceOptions.value.length === 1 && !selectedSourceId.value) {
    selectedSourceId.value = sourceOptions.value[0].value;
  }
});

const sourceStore = computed(() => storagesStore.getById(selectedSourceId.value));

// Destinations found in the selected source.
const destinationOptions = computed(() => {
  const store = sourceStore.value;
  if (!store) {
    return [];
  }
  const dests = new Set<string>();
  for (const item of store.items) {
    if (item.type !== 'SHIPMENT') {
      continue;
    }
    const dest = contractsStore.getDestinationByShipmentId(item.id);
    dests.add(getDestinationName(dest) ?? 'Unknown');
  }
  return [...dests].sort();
});

const selectedDestination = ref('');

// Auto-select if only one destination.
watchEffect(() => {
  if (destinationOptions.value.length === 1 && !selectedDestination.value) {
    selectedDestination.value = destinationOptions.value[0];
  }
  // Reset if source changes and destination no longer valid.
  if (selectedDestination.value && !destinationOptions.value.includes(selectedDestination.value)) {
    selectedDestination.value =
      destinationOptions.value.length === 1 ? destinationOptions.value[0] : '';
  }
});

// Stores at the same location that can receive items.
const targetOptions = computed(() => {
  const store = sourceStore.value;
  if (!store) {
    return [];
  }
  const allStores = storagesStore.all.value ?? [];
  const colocated = getColocatedStores(store, allStores);
  return colocated.map(x => ({
    label: `${getStoreName(x)} (${x.type.replace('_STORE', '').replace('_', ' ')})`,
    value: x.id,
  }));
});

const selectedTargetId = ref('');

// Auto-select if only one target.
watchEffect(() => {
  if (targetOptions.value.length === 1 && !selectedTargetId.value) {
    selectedTargetId.value = targetOptions.value[0].value;
  }
  if (
    selectedTargetId.value &&
    !targetOptions.value.find(x => x.value === selectedTargetId.value)
  ) {
    selectedTargetId.value = targetOptions.value.length === 1 ? targetOptions.value[0].value : '';
  }
});

// Filtered SHPT items matching source + destination.
const filteredItems = computed<ShipmentItem[]>(() => {
  const store = sourceStore.value;
  if (!store || !selectedDestination.value) {
    return [];
  }
  return store.items
    .filter(x => x.type === 'SHIPMENT')
    .map(x => {
      const dest = contractsStore.getDestinationByShipmentId(x.id);
      const destName = getDestinationName(dest) ?? 'Unknown';
      const contract = contractsStore.getByShipmentId(x.id);
      return {
        id: x.id,
        weight: x.weight,
        volume: x.volume,
        destination: destName,
        contractId: contract?.localId ?? '',
      };
    })
    .filter(x => x.destination === selectedDestination.value);
});

const totalWeight = computed(() => sumBy(filteredItems.value, x => x.weight));
const totalVolume = computed(() => sumBy(filteredItems.value, x => x.volume));

const targetStore = computed(() => storagesStore.getById(selectedTargetId.value));

const canTransfer = computed(
  () =>
    selectedSourceId.value !== '' &&
    selectedTargetId.value !== '' &&
    filteredItems.value.length > 0,
);

// Check if an item fits in the target store.
function itemFits(item: ShipmentItem): boolean {
  const target = targetStore.value;
  if (!target) {
    return false;
  }
  const weightOk = target.weightCapacity - target.weightLoad >= item.weight;
  const volumeOk = target.volumeCapacity - target.volumeLoad >= item.volume;
  return weightOk && volumeOk;
}

const transferring = ref(false);
const transferError = ref('');

async function onTransferOne(itemId: string) {
  if (!canTransfer.value || transferring.value) {
    return;
  }
  transferError.value = '';
  const ok = transferItem(selectedSourceId.value, selectedTargetId.value, itemId);
  if (!ok) {
    transferError.value = 'Not connected to server.';
    return;
  }
  transferring.value = true;
  // Wait for the item to disappear from the source store.
  const timeout = setTimeout(() => {
    transferring.value = false;
    transferError.value = 'Transfer timed out.';
  }, 5000);
  const stop = watch(
    () => sourceStore.value?.items.find(x => x.id === itemId),
    item => {
      if (!item) {
        clearTimeout(timeout);
        transferring.value = false;
        stop();
      }
    },
  );
}
</script>

<template>
  <SectionHeader>Transfer Shipments</SectionHeader>
  <Active label="Source">
    <SelectInput v-model="selectedSourceId" :options="sourceOptions" />
  </Active>
  <Active label="Destination">
    <SelectInput v-model="selectedDestination" :options="destinationOptions" />
  </Active>
  <Active label="Transfer To">
    <SelectInput v-model="selectedTargetId" :options="targetOptions" />
  </Active>
  <template v-if="filteredItems.length > 0">
    <SectionHeader>
      {{ filteredItems.length }} boxes to {{ selectedDestination }} ({{ fixed2(totalWeight) }}t /
      {{ fixed2(totalVolume) }}m³)
    </SectionHeader>
    <div v-if="transferError" :class="$style.error">{{ transferError }}</div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Weight</th>
          <th>Volume</th>
          <th>Contract</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in filteredItems"
          :key="item.id"
          :class="{ [$style.noFit]: !itemFits(item) }">
          <td>{{ item.id.slice(0, 8) }}</td>
          <td>{{ fixed2(item.weight) }}t</td>
          <td>{{ fixed2(item.volume) }}m³</td>
          <td>{{ item.contractId }}</td>
          <td>
            <PrunButton
              primary
              :disabled="!canTransfer || transferring"
              @click="onTransferOne(item.id)">
              TRANSFER
            </PrunButton>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
</template>

<style module>
.error {
  color: rgb(217, 83, 79);
  padding: 4px 8px;
  font-size: 12px;
}

.noFit {
  opacity: 0.5;
}
</style>
