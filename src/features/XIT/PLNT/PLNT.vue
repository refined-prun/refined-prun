<script setup lang="ts">
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import NumberInput from '@src/components/forms/NumberInput.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import Tooltip from '@src/components/Tooltip.vue';
import InlineFlex from '@src/components/InlineFlex.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { userData } from '@src/store/user-data';
import { comparePlanets } from '@src/util';
import { shipSizes } from '@src/core/ship-sizes';

interface Row {
  siteId: string;
  naturalId: string;
  planetName: string;
  resupply: WritableComputedRef<number | undefined>;
  pickup: WritableComputedRef<string, string | undefined>;
  repairThreshold: WritableComputedRef<number | undefined>;
  repairOffset: WritableComputedRef<number | undefined>;
}

const rows = computed(() => {
  if (!sitesStore.all.value) {
    return undefined;
  }
  const result: Row[] = [];
  for (const site of sitesStore.all.value) {
    const naturalId = getEntityNaturalIdFromAddress(site.address);
    const planetName = getEntityNameFromAddress(site.address);
    if (!naturalId || !planetName) {
      continue;
    }
    result.push({
      siteId: site.siteId,
      naturalId,
      planetName,
      resupply: computed({
        get: () => getResupplyOverride(naturalId),
        set: value => setResupplyOverride(naturalId, value),
      }),
      pickup: computed({
        get: () => getPickup(naturalId),
        set: value => setPickup(naturalId, value),
      }),
      repairThreshold: computed({
        get: () => getRepairOverride(naturalId)?.threshold,
        set: value => setRepairField(naturalId, 'threshold', value),
      }),
      repairOffset: computed({
        get: () => getRepairOverride(naturalId)?.offset,
        set: value => setRepairField(naturalId, 'offset', value),
      }),
    });
  }
  result.sort((a, b) => comparePlanets(a.naturalId, b.naturalId));
  return result;
});

const defaultResupply = computed(() => userData.settings.burn.resupply);
const defaultThreshold = computed(() => userData.settings.repair.threshold);
const defaultOffset = computed(() => userData.settings.repair.offset);

function getResupplyOverride(naturalId: string) {
  return userData.settings.burn.planetResupply[naturalId];
}

function setResupplyOverride(naturalId: string, value: number | undefined) {
  const map = userData.settings.burn.planetResupply;
  if (value === undefined) {
    delete map[naturalId];
  } else {
    map[naturalId] = value;
  }
}

const pickupOptions = [
  { label: '-', value: '' },
  ...shipSizes.map(x => ({ label: x.label, value: x.id })),
];

function getPickup(naturalId: string) {
  return userData.settings.burn.planetPickup[naturalId] ?? '';
}

function setPickup(naturalId: string, value: string | undefined) {
  const map = userData.settings.burn.planetPickup;
  if (value === undefined || value === '') {
    delete map[naturalId];
  } else {
    map[naturalId] = value;
  }
}

function getRepairOverride(naturalId: string) {
  return userData.settings.repair.planetOverrides[naturalId];
}

function setRepairField(
  naturalId: string,
  field: 'threshold' | 'offset',
  value: number | undefined,
) {
  const map = userData.settings.repair.planetOverrides;
  const entry = map[naturalId];
  if (value === undefined) {
    if (entry === undefined) {
      return;
    }
    delete entry[field];
    if (entry.threshold === undefined && entry.offset === undefined) {
      delete map[naturalId];
    }
  } else {
    if (entry === undefined) {
      map[naturalId] = { [field]: value };
    } else {
      entry[field] = value;
    }
  }
}
</script>

<template>
  <LoadingSpinner v-if="rows === undefined" />
  <div v-else-if="rows.length === 0" :class="$style.empty">No bases yet</div>
  <template v-else>
    <div :class="$style.note">
      Clear any number field to remove its override and use the default value (from XIT SET / XIT
      REP).
    </div>
    <table :class="$style.table">
      <thead>
        <tr>
          <th :class="$style.planet">Planet</th>
          <th>
            <InlineFlex>
              Resupply Days
              <Tooltip
                position="bottom"
                :tooltip="`Per-planet override. Leave empty to use the default (${defaultResupply} days) from XIT SET.`" />
            </InlineFlex>
          </th>
          <th>
            <InlineFlex>
              Pickup
              <Tooltip
                position="bottom"
                tooltip="Cargo size (weight / volume) of the ship you collect this base's output with. XIT BS shows a green &#x1F680; next to the base's inventory bar 24 hours before the base's produced goods fill that ship - until a ship is in flight to the planet." />
            </InlineFlex>
          </th>
          <th>
            <InlineFlex>
              Repair Threshold
              <Tooltip
                position="bottom"
                :tooltip="`Per-planet override. Leave empty to use the default (${defaultThreshold} days) from XIT REP.`" />
            </InlineFlex>
          </th>
          <th>
            <InlineFlex>
              Repair Offset
              <Tooltip
                position="bottom"
                :tooltip="`Per-planet override. Leave empty to use the default (${defaultOffset} days) from XIT REP.`" />
            </InlineFlex>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.siteId" :class="$style.row">
          <td :class="$style.planet">{{ row.planetName }}</td>
          <td :class="$style.input">
            <div :class="C.forms.input">
              <NumberInput v-model="row.resupply.value" optional float />
            </div>
          </td>
          <td :class="$style.pickup">
            <div :class="[C.forms.input, $style.selectWrap]">
              <SelectInput v-model="row.pickup.value" :options="pickupOptions" />
            </div>
          </td>
          <td :class="$style.input">
            <div :class="C.forms.input">
              <NumberInput v-model="row.repairThreshold.value" optional float />
            </div>
          </td>
          <td :class="$style.input">
            <div :class="C.forms.input">
              <NumberInput v-model="row.repairOffset.value" optional float />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
</template>

<style module>
.table {
  width: 100%;
}

.planet {
  text-align: left;
  font-weight: bold;
  font-size: 12px;
  padding-left: 12px;
  white-space: nowrap;
}

.row {
  border-bottom: 1px solid #2b485a;
}

.input {
  width: 80px;
}

.input > div {
  display: inline-block;
  width: 100%;
}

.input input {
  width: 100%;
}

.pickup {
  width: 110px;
}

.selectWrap {
  width: 100%;
  display: inline-block;
  vertical-align: middle;
}

.selectWrap :global(div) {
  width: 100%;
  margin-left: 0;
}

.empty {
  padding: 1rem;
  font-style: italic;
  opacity: 0.7;
  text-align: center;
}

.note {
  padding: 6px 8px;
  font-size: 12px;
  opacity: 0.85;
  background-color: rgba(100, 149, 237, 0.08);
  border-left: 3px solid #6495ed;
}
</style>
