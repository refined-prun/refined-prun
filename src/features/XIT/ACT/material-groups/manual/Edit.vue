<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import { objectId } from '@src/utils/object-id';
import Commands from '@src/components/forms/Commands.vue';
import PrunButton from '@src/components/PrunButton.vue';
import NumberInput from '@src/components/forms/NumberInput.vue';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

const { group } = defineProps<{ group: UserData.MaterialGroupData }>();

const materials = ref(getMaterials());

function getMaterials() {
  const materials = group.materials ?? {};
  return Object.keys(materials).map(x => [x, materials[x]]) as [string, number][];
}

function onAddClick() {
  materials.value.push(['', 0]);
}

function validate() {
  return true;
}

function save() {
  group.materials = {};
  for (let [ticker, amount] of materials.value) {
    const material = materialsStore.getByTicker(ticker);
    if (!material || !amount || !isFinite(amount)) {
      continue;
    }
    group.materials[material.ticker] = amount;
  }
}

defineExpose({ validate, save });
</script>

<template>
  <template v-for="(pair, i) in materials" :key="objectId(pair)">
    <Active :label="`Material Ticker #${i + 1}`">
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
