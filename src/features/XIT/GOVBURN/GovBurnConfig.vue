<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import Commands from '@src/components/forms/Commands.vue';
import NumberInput from '@src/components/forms/NumberInput.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import PrunButton from '@src/components/PrunButton.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import { popiBuildings } from '@src/core/popi-buildings';
import GovBurnImport from '@src/features/XIT/GOVBURN/GovBurnImport.vue';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { userData } from '@src/store/user-data';
import { comparePlanets } from '@src/util';

const emit = defineEmits<{ (e: 'done'): void }>();

const showImport = ref(false);
const planetInput = ref('');
const planetError = ref(false);

const configuredPlanets = computed(() =>
  Object.keys(userData.govburn.config.planets).sort(comparePlanets),
);

function planetName(naturalId: string) {
  return (
    userData.govburn.planets[naturalId]?.name ?? planetsStore.find(naturalId)?.name ?? naturalId
  );
}

function getRequired(naturalId: string, ticker: string) {
  return userData.govburn.config.planets[naturalId]?.[ticker] ?? -1;
}

function maxRequired(naturalId: string, ticker: string) {
  return (
    userData.govburn.planets[naturalId]?.buildings.find(x => x.ticker === ticker)?.upkeeps
      ?.length ?? 6
  );
}

function hasBuilding(naturalId: string, ticker: string) {
  const building = userData.govburn.planets[naturalId]?.buildings.find(x => x.ticker === ticker);
  return building !== undefined && building.level > 0;
}

function onRequiredChange(naturalId: string, ticker: string, ev: Event) {
  const config = userData.govburn.config.planets[naturalId];
  if (config === undefined) {
    return;
  }
  const input = ev.target as HTMLInputElement;
  const parsed = parseInt(input.value, 10);
  const max = maxRequired(naturalId, ticker);
  const clamped = Number.isNaN(parsed) ? -1 : Math.max(-1, Math.min(max, parsed));
  config[ticker] = clamped;
  input.value = String(clamped);
}

function addPlanet() {
  const term = planetInput.value.trim();
  if (!term) {
    planetError.value = true;
    return;
  }
  const planet = planetsStore.find(term);
  if (!planet) {
    planetError.value = true;
    return;
  }
  planetError.value = false;
  userData.govburn.config.planets[planet.naturalId] ??= Object.fromEntries(
    popiBuildings.map(x => [x.ticker, -1]),
  );
  planetInput.value = '';
}

function removePlanet(naturalId: string) {
  delete userData.govburn.config.planets[naturalId];
  delete userData.govburn.config.slots[naturalId];
}

function onInputKeydown(ev: KeyboardEvent) {
  if (ev.key === 'Enter') {
    addPlanet();
  }
}
</script>

<template>
  <GovBurnImport v-if="showImport" @done="showImport = false" />
  <template v-else>
    <div :class="C.ComExOrdersPanel.filter">
      <div :class="$style.spacer" />
      <PrunButton primary @click="showImport = true">IMPORT</PrunButton>
      <PrunButton primary @click="emit('done')">DONE</PrunButton>
    </div>

    <SectionHeader>Thresholds</SectionHeader>
    <form @submit.prevent>
      <Active label="Red (days)">
        <NumberInput v-model="userData.govburn.config.red" float />
      </Active>
      <Active label="Yellow (days)">
        <NumberInput v-model="userData.govburn.config.yellow" float />
      </Active>
    </form>

    <SectionHeader>Add Planet</SectionHeader>
    <form @submit.prevent>
      <Active label="Planet" :error="planetError">
        <TextInput v-model="planetInput" @keydown="onInputKeydown" />
      </Active>
      <Commands>
        <PrunButton primary @click="addPlanet">ADD</PrunButton>
      </Commands>
    </form>
    <p v-if="planetError" :class="$style.error">Planet not found.</p>

    <table v-if="configuredPlanets.length > 0">
      <thead>
        <tr>
          <th>Planet</th>
          <th v-for="building in popiBuildings" :key="building.ticker">{{ building.ticker }}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="naturalId in configuredPlanets" :key="naturalId">
          <td>{{ planetName(naturalId) }}</td>
          <td v-for="building in popiBuildings" :key="building.ticker">
            <div
              v-if="hasBuilding(naturalId, building.ticker)"
              :class="[C.forms.input, $style.numberWrap]">
              <input
                type="number"
                :min="-1"
                :max="maxRequired(naturalId, building.ticker)"
                :value="getRequired(naturalId, building.ticker)"
                @change="onRequiredChange(naturalId, building.ticker, $event)" />
            </div>
          </td>
          <td>
            <PrunButton danger inline @click="removePlanet(naturalId)">REMOVE</PrunButton>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
</template>

<style module>
.spacer {
  flex: 1;
}

.error {
  margin: 0.25rem 0;
  color: rgb(217, 83, 79);
}

.numberWrap {
  width: 2.5rem;
}

.numberWrap input {
  width: 100%;
  margin-left: 0;
  text-align: center;
}
</style>
