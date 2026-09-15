<script setup lang="ts">
import NumberInput from '@src/components/forms/NumberInput.vue';
import {
  calculateBuildingEntries,
  calculateShipEntries,
  getParameterShips,
  getParameterSites,
} from '@src/features/XIT/REP/entries';
import { timestampEachMinute } from '@src/utils/dayjs';
import dayjs from 'dayjs';
import { fixed02, fixed1, percent1 } from '@src/utils/format';
import MaterialPurchaseTable from '@src/components/MaterialPurchaseTable.vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { calcBuildingCondition, getRepairOffset, getRepairThreshold } from '@src/core/buildings';
import { diffDays } from '@src/utils/time-diff';
import { userData } from '@src/store/user-data';
import { mergeMaterialAmounts } from '@src/core/sort-materials';
import Active from '@src/components/forms/Active.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import PrunLink from '@src/components/PrunLink.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { objectId } from '@src/utils/object-id';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';

const parameters = useXitParameters();

const sites = computed(() => getParameterSites(parameters));
const ships = computed(() => getParameterShips(parameters));

const isMultiTarget = computed(
  () => (sites.value?.length ?? 0) > 1 || (ships.value?.length ?? 0) > 0,
);

const buildingEntries = computed(() => calculateBuildingEntries(sites.value));
const shipEntries = computed(() => calculateShipEntries(ships.value));

const msInADay = dayjs.duration(1, 'day').asMilliseconds();

const visibleBuildings = computed(() => {
  if (buildingEntries.value === undefined) {
    return undefined;
  }
  const time = timestampEachMinute.value;
  return buildingEntries.value.filter(entry => {
    const threshold = getRepairThreshold(entry.naturalId);
    const offset = getRepairOffset(entry.naturalId);
    const splitDate = time - threshold * msInADay + offset * msInADay;
    return entry.lastRepair < splitDate;
  });
});

const visibleShips = computed(() => shipEntries.value?.filter(x => x.condition <= 0.85));

const materials = computed(() => {
  if (visibleBuildings.value === undefined || visibleShips.value === undefined) {
    return undefined;
  }
  const materials: PrunApi.MaterialAmount[] = [];
  const time = timestampEachMinute.value;
  for (const building of visibleBuildings.value) {
    const plannedRepairDate =
      (time - building.lastRepair) / msInADay + getRepairOffset(building.naturalId);
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
  return diffDays(lastRepair, timestampEachMinute.value, true);
}

const singleSite = computed(() => {
  if (sites.value?.length === 1 && (ships.value?.length ?? 0) === 0) {
    return sites.value[0];
  }
  return undefined;
});

const singleSiteInfo = computed(() => {
  const site = singleSite.value;
  if (!site) {
    return undefined;
  }
  const naturalId = getEntityNaturalIdFromAddress(site.address);
  if (!naturalId) {
    return undefined;
  }
  const override = userData.settings.repair.planetOverrides[naturalId];
  if (
    override === undefined ||
    (override.threshold === undefined && override.offset === undefined)
  ) {
    return undefined;
  }
  return {
    planetName: getEntityNameFromAddress(site.address) ?? naturalId,
    threshold: getRepairThreshold(naturalId),
    offset: getRepairOffset(naturalId),
  };
});
</script>

<template>
  <LoadingSpinner v-if="materials === undefined" />
  <template v-else>
    <div v-if="singleSiteInfo" :class="$style.overrideNotice">
      <span>
        Using XIT PLS override for <b>{{ singleSiteInfo.planetName }}</b
        >: threshold <b>{{ fixed02(singleSiteInfo.threshold) }}</b
        >, offset <b>{{ fixed02(singleSiteInfo.offset) }}</b
        >.
      </span>
      <PrunButton dark inline @click="showBuffer('XIT PLS')">Edit in XIT PLS</PrunButton>
    </div>
    <form v-else>
      <Active label="Age Threshold">
        <NumberInput v-model="userData.settings.repair.threshold" float />
      </Active>
      <Active label="Time Offset">
        <NumberInput v-model="userData.settings.repair.offset" float />
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
          <th>CMD</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in visibleBuildings" :key="objectId(entry)">
          <td>{{ entry.ticker }}</td>
          <td v-if="isMultiTarget">
            <PrunLink :command="`XIT REP ${entry.naturalId}`">{{ entry.target }}</PrunLink>
          </td>
          <td>{{ fixed1(calculateAge(entry.lastRepair)) }}</td>
          <td>{{ percent1(entry.condition) }}</td>
          <td>
            <PrunButton dark inline @click="showBuffer(`XIT REPAIRACT ${entry.naturalId}`)">
              ACT
            </PrunButton>
          </td>
        </tr>
        <tr v-for="entry in visibleShips" :key="objectId(entry)">
          <td>(Ship)</td>
          <td>{{ entry.target }}</td>
          <td>{{ fixed1(calculateAge(entry.lastRepair)) }}</td>
          <td>{{ percent1(entry.condition) }}</td>
          <td />
        </tr>
      </tbody>
    </table>
  </template>
</template>

<style module>
.overrideNotice {
  padding: 6px 8px;
  font-size: 12px;
  background-color: rgba(100, 149, 237, 0.08);
  border-left: 3px solid #6495ed;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
</style>
