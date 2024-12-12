<script setup lang="ts">
import NumberInput from '@src/components/forms/NumberInput.vue';
import {
  calculateBuildingEntries,
  calculateShipEntries,
  getParameterShips,
  getParameterSites,
} from '@src/features/XIT/REP/entries';
import { timestampEachSecond } from '@src/utils/dayjs';
import { binarySearch } from '@src/utils/binary-search';
import dayjs from 'dayjs';
import { fixed1, percent1 } from '@src/utils/format';
import MaterialPurchaseTable from '@src/components/MaterialPurchaseTable.vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { calcBuildingCondition } from '@src/core/buildings';
import { diffDays } from '@src/utils/time-diff';
import { userData } from '@src/store/user-data';
import { mergeMaterialAmounts } from '@src/core/sort-materials';
import Active from '@src/components/forms/Active.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import PrunLink from '@src/components/PrunLink.vue';

const parameters = useXitParameters();

const sites = computed(() => getParameterSites(parameters));
const ships = computed(() => getParameterShips(parameters));

const isMultiTarget = computed(
  () => (sites.value?.length ?? 0) > 1 || (ships.value?.length ?? 0) > 0,
);

const buildingEntries = computed(() => calculateBuildingEntries(sites.value));
const shipEntries = computed(() => calculateShipEntries(ships.value));

const msInADay = dayjs.duration(1, 'day').asMilliseconds();

const currentSplitIndex = computed(() => {
  if (buildingEntries.value === undefined) {
    return undefined;
  }
  const settings = userData.settings.repair;
  const currentSplitDate =
    timestampEachSecond.value - settings.threshold * msInADay + settings.offset * msInADay;
  return binarySearch(currentSplitDate, buildingEntries.value, x => x.lastRepair);
});

const visibleBuildings = computed(() => {
  return buildingEntries.value?.slice(0, currentSplitIndex.value);
});

const visibleShips = computed(() => shipEntries.value?.filter(x => x.condition <= 0.85));

const materials = computed(() => {
  if (visibleBuildings.value === undefined || visibleShips.value === undefined) {
    return undefined;
  }
  const materials: PrunApi.MaterialAmount[] = [];
  const time = timestampEachSecond.value;
  for (const building of visibleBuildings.value) {
    const plannedRepairDate =
      (time - building.lastRepair) / msInADay + userData.settings.repair.offset;
    for (const { material, amount } of building.fullMaterials) {
      materials.push({
        material,
        amount: Math.ceil(amount * (1 - calcBuildingCondition(plannedRepairDate))),
      });
    }
  }
  materials.push(...visibleShips.value.flatMap(x => x.materials));
  return mergeMaterialAmounts(materials);
});

function calculateAge(lastRepair: number) {
  return diffDays(lastRepair, timestampEachSecond.value, true);
}
</script>

<template>
  <LoadingSpinner v-if="materials === undefined" />
  <template v-else>
    <form>
      <Active label="Age Threshold">
        <NumberInput v-model="userData.settings.repair.threshold" />
      </Active>
      <Active label="Time Offset">
        <NumberInput v-model="userData.settings.repair.offset" />
      </Active>
    </form>
    <SectionHeader>Shopping Cart</SectionHeader>
    <MaterialPurchaseTable
      :collapsible="isMultiTarget"
      :collapsed-by-default="true"
      :materials="materials" />
    <SectionHeader>Buildings</SectionHeader>
    <table>
      <thead>
        <tr>
          <th>Ticker</th>
          <th v-if="isMultiTarget">Target</th>
          <th>Age (days)</th>
          <th>Condition</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, i) in visibleBuildings" :key="i">
          <td>{{ entry.ticker }}</td>
          <td v-if="isMultiTarget">
            <PrunLink :command="`XIT REP ${entry.naturalId}`">{{ entry.target }}</PrunLink>
          </td>
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
  </template>
</template>
