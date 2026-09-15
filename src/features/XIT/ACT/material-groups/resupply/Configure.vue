<script setup lang="ts">
import SelectInput from '@src/components/forms/SelectInput.vue';
import Active from '@src/components/forms/Active.vue';
import NumberInput from '@src/components/forms/NumberInput.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { Config, MaterialFilter } from '@src/features/XIT/ACT/material-groups/resupply/config';
import { computeResupplyBill } from '@src/features/XIT/ACT/material-groups/resupply/bill';
import { maxFittingDays } from '@src/features/XIT/ACT/material-groups/resupply/fit-days';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { comparePlanets } from '@src/util';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';
import { getResupplyDays } from '@src/core/burn';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { fixed02 } from '@src/utils/format';
import { shipSizes } from '@src/core/ship-sizes';
import { billTotals } from '@src/features/XIT/ACT/material-bill';

const { data, config, shipStore } = defineProps<{
  data: UserData.MaterialGroupData;
  config: Config;
  shipStore?: PrunApi.Store;
}>();

const planets = computed(() =>
  (sitesStore.all.value ?? [])
    .map(x => getEntityNameFromAddress(x.address))
    .filter(x => x !== undefined)
    .sort(comparePlanets),
);

if (data.planet === configurableValue && !config.planet) {
  config.planet = planets.value[0];
}

if (data.days === configurableValue && config.days === undefined) {
  const seedPlanet = data.planet === configurableValue ? config.planet : data.planet;
  const seedSite = seedPlanet ? sitesStore.getByPlanetNaturalIdOrName(seedPlanet) : undefined;
  const seedNaturalId = seedSite ? getEntityNaturalIdFromAddress(seedSite.address) : undefined;
  config.days = getResupplyDays(seedNaturalId) ?? 10;
}

const materialFilterOptions: MaterialFilter[] = ['All', 'Workforce', 'Production'];
const materialFilter = ref<MaterialFilter>(
  config.materialFilter ?? data.materialFilter ?? (data.consumablesOnly ? 'Workforce' : 'All'),
);
config.materialFilter = materialFilter.value;
watch(materialFilter, val => {
  config.materialFilter = val;
});

const effectivePlanet = computed(() =>
  data.planet === configurableValue ? config.planet : data.planet,
);

const effectiveDays = computed(() => {
  if (data.days === configurableValue) {
    return config.days;
  }
  if (typeof data.days === 'number') {
    return data.days;
  }
  const parsed = parseFloat(data.days as string);
  return isNaN(parsed) ? undefined : parsed;
});

const bill = computed(() =>
  computeResupplyBill(data, effectivePlanet.value, effectiveDays.value, materialFilter.value),
);

const totals = computed(() => {
  const entries = bill.value;
  if (!entries) {
    return undefined;
  }
  return billTotals(entries);
});

// Binary search for the maximum duration whose bill fits the ship.
function fitToShip(maxWeight: number, maxVolume: number) {
  const planet = effectivePlanet.value;
  if (!planet) {
    return;
  }
  // Quick check that burn data is loaded.
  if (!computeResupplyBill(data, planet, 1, materialFilter.value)) {
    return;
  }
  config.days = maxFittingDays(days => {
    const entries = computeResupplyBill(data, planet, days, materialFilter.value)!;
    const t = billTotals(entries);
    return t.weight <= maxWeight && t.volume <= maxVolume;
  });
}

const canFit = computed(() => bill.value !== undefined);

const shipFree = computed(() => {
  if (!shipStore) {
    return undefined;
  }
  return {
    weight: shipStore.weightCapacity - shipStore.weightLoad,
    volume: shipStore.volumeCapacity - shipStore.volumeLoad,
  };
});

const shipName = computed(() => {
  if (!shipStore) {
    return undefined;
  }
  const ship = shipsStore.getById(shipStore.addressableId);
  return ship?.name ?? ship?.registration;
});
</script>

<template>
  <form>
    <Active v-if="data.planet === configurableValue" label="Planet">
      <SelectInput v-model="config.planet" :options="planets" />
    </Active>
    <Active
      v-if="data.days === configurableValue"
      label="Days"
      tooltip="The number of days of supplies to refill the planet with.">
      <NumberInput v-model="config.days" float />
    </Active>
  </form>
  <Active label="Materials" tooltip="Which materials to include in the resupply group.">
    <SelectInput v-model="materialFilter" :options="materialFilterOptions" />
  </Active>
  <div :class="$style.totals">
    <template v-if="totals">
      <span>Total Weight </span>
      <span :class="$style.value">{{ fixed02(totals.weight) }}t</span>
      <span>, Total Volume </span>
      <span :class="$style.value">{{ fixed02(totals.volume) }}m³</span>
    </template>
    <template v-else>
      <span>Total Weight --, Total Volume --</span>
    </template>
  </div>
  <div v-if="data.days === configurableValue" :class="$style.fitRow">
    <span>Fit to Ship</span>
    <PrunButton
      v-for="ship in shipSizes"
      :key="ship.id"
      primary
      :disabled="!canFit"
      @click="fitToShip(ship.weight, ship.volume)">
      {{ ship.id }}
    </PrunButton>
    <div v-if="shipName && shipFree" :class="$style.fitSelected">
      <span>Fit Selected</span>
      <PrunButton primary :disabled="!canFit" @click="fitToShip(shipFree.weight, shipFree.volume)">
        {{ shipName.slice(0, 12) }}
      </PrunButton>
    </div>
  </div>
</template>

<style module>
.totals {
  margin: 4px 4px 4px 8px;
}

.value {
  color: #f7a600;
}

.fitRow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: 2px 4px 4px 8px;
  white-space: nowrap;

  > * {
    flex-shrink: 0;
  }
}

.fitSelected {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
