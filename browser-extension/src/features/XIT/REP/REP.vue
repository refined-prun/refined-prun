<script lang="ts">
import xit from '@src/features/XIT/xit-registry.js';
import REP from '@src/features/XIT/REP/REP.vue';

xit.add({
  command: 'REP',
  name: 'REPAIRS',
  component: () => REP,
});

export default {};
</script>

<script setup lang="ts">
import { computed } from 'vue';
import NumberInput from '@src/components/forms/NumberInput.vue';
import { calculateBuildingEntries, calculateShipEntries } from '@src/features/XIT/REP/entries';
import { timestampEachSecond } from '@src/utils/dayjs';
import { binarySearch } from '@src/utils/binary-search';
import dayjs from 'dayjs';
import { fixed1, percent1 } from '@src/utils/format';
import MaterialPurchaseTable from '@src/components/MaterialPurchaseTable.vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { calculateBuildingCondition } from '@src/core/buildings';
import { diffDays } from '@src/utils/time-diff';
import { userData } from '@src/store/user-data';
import { mergeMaterialAmounts } from '@src/core/sort-materials';

const props = defineProps({
  parameters: {
    type: Array<string>,
    required: true,
  },
});

const buildings = computed(() => calculateBuildingEntries(props.parameters));
const ships = computed(() => calculateShipEntries(props.parameters));

const msInADay = dayjs.duration(1, 'day').asMilliseconds();

const currentSplitIndex = computed(() => {
  if (buildings.value === undefined) {
    return undefined;
  }
  const settings = userData.settings.repair;
  const currentSplitDate =
    timestampEachSecond() - settings.threshold * msInADay + settings.offset * msInADay;
  return binarySearch(currentSplitDate, buildings.value, x => x.lastRepair);
});

const visibleBuildings = computed(() => {
  return buildings.value?.slice(0, currentSplitIndex.value);
});

const visibleShips = computed(() => ships.value?.filter(x => x.condition <= 0.85));

const materials = computed(() => {
  if (visibleBuildings.value === undefined || visibleShips.value === undefined) {
    return undefined;
  }
  const materials: PrunApi.MaterialAmount[] = [];
  const time = timestampEachSecond();
  for (const building of visibleBuildings.value) {
    const plannedRepairDate =
      (time - building.lastRepair) / msInADay + userData.settings.repair.offset;
    for (const { material, amount } of building.fullMaterials) {
      materials.push({
        material,
        amount: Math.ceil(amount * (1 - calculateBuildingCondition(plannedRepairDate))),
      });
    }
  }
  materials.push(...visibleShips.value.flatMap(x => x.materials));
  return mergeMaterialAmounts(materials);
});

function calculateAge(lastRepair: number) {
  return diffDays(lastRepair, timestampEachSecond(), true);
}
</script>

<template>
  <LoadingSpinner v-if="materials === undefined" />
  <div v-else :style="{ height: '100%', flexGrow: 1, paddingTop: '4px' }">
    <span class="title">All Repairs</span>
    <div>
      <div style="display: inline">
        <span style="padding-left: 5px">Age Threshold:</span>
        <NumberInput v-model="userData.settings.repair.threshold" style="width: 60px" />
      </div>
      <div style="display: inline">
        <span style="padding-left: 5px">Time Offset:</span>
        <NumberInput v-model="userData.settings.repair.offset" style="width: 60px" />
      </div>
    </div>

    <span class="title" style="padding-bottom: 2px">Shopping Cart</span>
    <MaterialPurchaseTable :materials="materials" />

    <span class="title" style="padding-top: 5px; padding-bottom: 2px">Buildings</span>
    <table>
      <thead>
        <tr>
          <th>Ticker</th>
          <th>Target</th>
          <th>Age (days)</th>
          <th>Condition</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, i) in visibleBuildings" :key="i">
          <td>{{ entry.ticker }}</td>
          <td>{{ entry.target }}</td>
          <td>{{ fixed1(calculateAge(entry.lastRepair)) }}</td>
          <td>{{ percent1(entry.condition) }}</td>
        </tr>
        <tr v-for="(entry, i) in visibleShips" :key="i">
          <td>(Ship)</td>
          <td>{{ entry.target }}</td>
          <td>{{ fixed1(calculateAge(entry.lastRepair)) }}</td>
          <td>{{ percent1(entry.condition) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
