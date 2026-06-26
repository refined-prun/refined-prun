<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import Commands from '@src/components/forms/Commands.vue';
import { userData } from '@src/store/user-data';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import NumberInput from '@src/components/forms/NumberInput.vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
  getLocationLineFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { comparePlanets } from '@src/util';
import SelectInput from '@src/components/forms/SelectInput.vue';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { configurableValue } from '@src/features/XIT/ACT/shared-types';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { serializeStorage } from '@src/features/XIT/ACT/actions/utils';

const emit = defineEmits<{ (e: 'close'): void }>();

const days = ref(userData.settings.burn.resupply);
const name = ref(`Base Resupply ${days.value}d`);
const planets = computed(() =>
  (sitesStore.all.value ?? [])
    .map(x => getEntityNameFromAddress(x.address))
    .filter(x => x !== undefined)
    .sort(comparePlanets),
);
const planet = ref(planets.value[0]);

const cxes = computed(
  () =>
    warehousesStore.all.value
      ?.filter(x => getLocationLineFromAddress(x.address)?.type === 'STATION')
      .map(x => ({
        label: getEntityNameFromAddress(x.address)!,
        value: getEntityNaturalIdFromAddress(x.address)!,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)) ?? [],
);
const cx = ref(cxes.value[0].value);

function onCreateClick() {
  if (name.value.length === 0) {
    return;
  }
  const warehouse = warehousesStore.getByEntityNaturalId(cx.value);
  const storage = storagesStore.getById(warehouse!.storeId)!;
  const cxTicker = ExchangeTickers[cx.value];
  userData.actionPackages.push({
    global: { name: name.value },
    groups: [
      {
        name: 'Resupply',
        type: 'Resupply',
        planet: planet.value,
        days: days.value,
        useBaseInv: true,
      },
    ],
    actions: [
      {
        name: 'Buy Missing Materials',
        type: 'CX Buy',
        group: 'Resupply',
        exchange: cxTicker,
        useCXInv: true,
      },
      {
        name: 'Select your ship in the "To" field ↓',
        type: 'MTRA',
        group: 'Resupply',
        origin: serializeStorage(storage),
        dest: configurableValue,
      },
    ],
  });
  showBuffer('XIT ACT_' + name.value.split(' ').join('_'));
  emit('close');
}

const ExchangeTickers = {
  ANT: 'AI1',
  BEN: 'CI1',
  MOR: 'NC1',
  HRT: 'IC1',
  HUB: 'NC2',
  ARC: 'CI2',
};
</script>

<template>
  <div :class="C.DraftConditionEditor.form">
    <SectionHeader>Quickstart</SectionHeader>
    <div :class="$style.description">
      This prefilled action package will resupply your base with materials for a given number of
      days.
      <br />
      The created action package will have two actions: buy missing materials from the CX, then
      transfer them to the configured (next step) ship.
      <br />
      After clicking "Create", you will be taken to the action package runner. Once there, first
      configure the target ship, then press "Execute" and press "Act" until the package is done.
      <br />
      <mark>Note: You need a ship parked at the selected CX for this to work.</mark>
    </div>
    <form>
      <Active label="Name">
        <TextInput v-model="name" />
      </Active>
      <Active label="CX to Resupply From">
        <SelectInput v-model="cx" :options="cxes" />
      </Active>
      <Active label="Planet to Resupply">
        <SelectInput v-model="planet" :options="planets" />
      </Active>
      <Active label="Resupply Days">
        <NumberInput v-model="days" />
      </Active>
      <Commands>
        <PrunButton primary @click="onCreateClick">CREATE</PrunButton>
      </Commands>
    </form>
  </div>
</template>

<style module>
.description {
  line-height: 13px;
  padding: 0 4px;
  background-color: #26353e;
  margin-bottom: 5px;
}
</style>
