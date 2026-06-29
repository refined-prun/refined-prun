<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import NumberInput from '@src/components/forms/NumberInput.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import Commands from '@src/components/forms/Commands.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { objectId } from '@src/utils/object-id';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { comparePlanets } from '@src/util';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';

const { group } = defineProps<{ group: UserData.MaterialGroupData }>();

// Planet selection logic (same as Resupply)
const planets = computed(() => {
  const planets = (sitesStore.all.value ?? [])
    .map(x => getEntityNameFromAddress(x.address))
    .filter(x => x !== undefined)
    .sort(comparePlanets);
  planets.unshift(configurableValue);
  return planets;
});

const planet = ref(group.planet ?? planets.value[0]);
const planetError = ref(false);

// Material list logic (same as Manual)
const materials = ref(getMaterials());
const materialErrors = ref<boolean[]>([]);

function getMaterials() {
  const materials = group.materials ?? {};
  return Object.keys(materials).map(x => [x, materials[x]]) as [string, number][];
}

function onAddClick() {
  materials.value.push(['', 0]);
}

function validate() {
  let isValid = true;
  planetError.value = !planet.value;
  isValid &&= !planetError.value;

  const errors = materials.value.map(([ticker, amount]) => {
    const material = materialsStore.getByTicker(ticker);
    return !(material && amount > 0);
  });
  materialErrors.value = errors;

  const hasValidMaterial = errors.some(error => !error);
  if (!hasValidMaterial) {
    isValid = false;
  }
  return isValid;
}

function save() {
  group.planet = planet.value;
  // Save material list
  group.materials = {};
  for (let [ticker, amount] of materials.value) {
    const material = materialsStore.getByTicker(ticker);
    if (!material || amount <= 0 || !isFinite(amount)) {
      continue;
    }
    group.materials[material.ticker] = amount;
  }
}

defineExpose({ validate, save });
</script>

<template>
  <Active label="Planet" :error="planetError">
    <SelectInput v-model="planet" :options="planets" />
  </Active>
  <template v-for="(pair, i) in materials" :key="objectId(pair)">
    <Active :label="`Material Ticker #${i + 1}`" :error="materialErrors[i]">
      <TextInput v-model="pair[0]" />
    </Active>
    <Active :label="`Material Amount #${i + 1}`">
      <NumberInput v-model="pair[1]" />
    </Active>
  </template>
  <Commands>
    <PrunButton primary @click="onAddClick">ADD MATERIAL</PrunButton>
  </Commands>
</template>
