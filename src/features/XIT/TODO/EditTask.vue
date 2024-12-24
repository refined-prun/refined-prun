<script setup lang="ts">
import SectionHeader from '@src/components/SectionHeader.vue';
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import NumberInput from '@src/components/forms/NumberInput.vue';
import Commands from '@src/components/forms/Commands.vue';
import PrunButton from '@src/components/PrunButton.vue';
import DateInput from '@src/components/forms/DateInput.vue';
import { toDueDate } from '@src/features/XIT/TODO/utils';
import { getBuildingLastRepair, sitesStore } from '@src/infrastructure/prun-api/data/sites';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { getPlanetBurn } from '@src/core/burn';
import { createId } from '@src/store/create-id';
import { fixed0 } from '@src/utils/format';
import { isRepairableBuilding } from '@src/core/buildings';
import { mergeMaterialAmounts, sortMaterialAmounts } from '@src/core/sort-materials';

const { onDelete, onSave, task } = defineProps<{
  onDelete?: () => void;
  onSave?: () => void;
  task: UserData.Task;
}>();

const emit = defineEmits<{ (e: 'close'): void }>();

const types: UserData.TaskType[] = ['Text', 'Resupply', 'Repair'];
const type = ref(task.type);

const text = ref(task.text);
const dueDate = ref(task.dueDate);
const recurring = ref(task.recurring);
const days = ref(task.days);
const buildingAge = ref(task.buildingAge);

const planets = computed(() => {
  if (!sitesStore.all) {
    return [];
  }

  return (sitesStore.all.value ?? []).map(x => ({
    label: getEntityNameFromAddress(x.address),
    value: getEntityNaturalIdFromAddress(x.address),
  }));
});

const planet = ref(
  planets.value.find(x => x.value === task.planet)?.value ?? planets.value[0]?.value,
);

watchEffect(() => {
  // Preload resupply
  const site = sitesStore.getByPlanetNaturalId(planet.value);
  getPlanetBurn(site);
});

function onSaveClick() {
  task.type = type.value;
  task.dueDate = toDueDate(dueDate.value);
  task.recurring = recurring.value;
  delete task.text;
  delete task.planet;
  delete task.days;
  delete task.buildingAge;
  delete task.subtasks;
  if (type.value === 'Text') {
    task.text = text.value;
  }
  if (type.value === 'Resupply') {
    task.planet = planet.value;
    task.days = days.value || 7;
    const site = sitesStore.getByPlanetNaturalId(task.planet)!;
    task.text =
      `Supply [[p:${getEntityNameFromAddress(site.address)}]] with ` +
      `${task.days} ${task.days === 1 ? 'day' : 'days'} of consumables.`;

    const burn = getPlanetBurn(site)?.burn;
    if (burn) {
      task.subtasks = [];
      for (const mat of Object.keys(burn)) {
        const daily = burn[mat].DailyAmount;
        if (daily < 0) {
          task.subtasks.push({
            id: createId(),
            type: 'Text',
            text: `${fixed0(-daily * task.days)} [[m:${mat}]]`,
          });
        }
      }
    }
  }
  if (type.value === 'Repair') {
    task.planet = planet.value;
    task.buildingAge = buildingAge.value || 50;
    const site = sitesStore.getByPlanetNaturalId(task.planet)!;
    task.text =
      `Repair buildings on [[p:${getEntityNameFromAddress(site.address)}]] ` +
      `older than ${task.buildingAge} ${task.days === 1 ? 'day' : 'days'}`;

    let materials: PrunApi.MaterialAmount[] = [];

    task.subtasks = [];
    if (site?.platforms) {
      for (const building of site.platforms) {
        const shouldRepair =
          isRepairableBuilding(building) &&
          Date.now() - getBuildingLastRepair(building) > task.buildingAge * 86400000;
        if (!shouldRepair) {
          continue;
        }
        materials.push(...building.repairMaterials);
      }
    }

    materials = sortMaterialAmounts(mergeMaterialAmounts(materials));
    for (let amount of materials) {
      task.subtasks.push({
        id: createId(),
        type: 'Text',
        text: `${fixed0(amount.amount)} [[m:${amount.material.ticker}]]`,
      });
    }
  }
  onSave?.();
  emit('close');
}

function onDeleteClick() {
  onDelete?.();
  emit('close');
}
</script>

<template>
  <div :class="C.DraftConditionEditor.form">
    <SectionHeader>Edit task</SectionHeader>
    <form>
      <Active label="Type">
        <SelectInput v-model="type" :options="types" />
      </Active>
      <Active label="Due Date">
        <DateInput v-model="dueDate" />
      </Active>
      <Active
        label="Recurring period"
        tooltip="An amount of days the due date will advance on task completion.">
        <NumberInput v-model="recurring" />
      </Active>
      <template v-if="type === 'Text'">
        <Active label="Text">
          <TextInput v-model="text" />
        </Active>
      </template>
      <template v-if="type === 'Resupply'">
        <Active label="Planet">
          <SelectInput v-model="planet" :options="planets" />
        </Active>
        <Active label="Days" tooltip="The number of days of supplies.">
          <NumberInput v-model="days" />
        </Active>
      </template>
      <template v-if="type === 'Repair'">
        <Active label="Planet">
          <SelectInput v-model="planet" :options="planets" />
        </Active>
        <Active label="Building age" tooltip="The minimum building age to be included in the list.">
          <NumberInput v-model="buildingAge" />
        </Active>
      </template>
      <Commands>
        <PrunButton primary @click="onSaveClick">SAVE</PrunButton>
        <PrunButton v-if="onDelete" danger @click="onDeleteClick">DELETE</PrunButton>
      </Commands>
    </form>
  </div>
</template>
