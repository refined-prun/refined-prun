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

interface ShipmentGroupData {
  destination: string;
  items: ShipmentItem[];
  totalWeight: number;
  totalVolume: number;
}

const { group } = defineProps<{ group: ShipmentGroupData }>();

const expanded = ref(false);

// Deduplicate contract IDs for the summary row.
const contractIds = computed(() => [
  ...new Set(group.items.map(x => x.contractId).filter(Boolean)),
]);
</script>

<template>
  <tbody>
    <tr :class="$style.groupRow" @click="expanded = !expanded">
      <td :class="$style.destination"> {{ expanded ? '-' : '+' }} {{ group.destination }} </td>
      <td>{{ group.items.length }}</td>
      <td>{{ fixed2(group.totalWeight) }}t</td>
      <td>{{ fixed2(group.totalVolume) }}m\u00B3</td>
      <td>
        <template v-for="(id, i) in contractIds" :key="id">
          <template v-if="i > 0">, </template>
          <PrunLink inline :command="`CONT ${id}`">{{ id }}</PrunLink>
        </template>
      </td>
    </tr>
    <template v-if="expanded">
      <tr v-for="item in group.items" :key="item.id" :class="$style.detailRow">
        <td :class="$style.itemId">{{ item.id }}</td>
        <td />
        <td>{{ fixed2(item.weight) }}t</td>
        <td>{{ fixed2(item.volume) }}m\u00B3</td>
        <td>
          <PrunLink v-if="item.contractId" inline :command="`CONT ${item.contractId}`">
            {{ item.contractId }}
          </PrunLink>
        </td>
      </tr>
    </template>
  </tbody>
</template>

<style module>
.groupRow {
  cursor: pointer;
  user-select: none;
}

.destination {
  font-weight: bold;
}

.detailRow {
  opacity: 0.7;
}

.itemId {
  padding-left: 18px;
  font-size: 11px;
}
</style>
