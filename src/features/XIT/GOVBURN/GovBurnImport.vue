<script setup lang="ts">
import Active from '@src/components/forms/Active.vue';
import Commands from '@src/components/forms/Commands.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import PrunButton from '@src/components/PrunButton.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import { popiBuildings } from '@src/core/popi-buildings';
import {
  buildImportPlan,
  parseGovBurnImport,
  type GovBurnImportPlan,
  type GovBurnImportRow,
} from '@src/features/XIT/GOVBURN/govburn-import';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { userData } from '@src/store/user-data';
import { uploadJson } from '@src/utils/json-file';

const emit = defineEmits<{ (e: 'done'): void }>();

type ImportType = 'TEXT' | 'FILE';

const typeOptions: { label: string; value: ImportType }[] = [
  { label: 'Paste JSON', value: 'TEXT' },
  { label: 'Upload JSON', value: 'FILE' },
];

const type = ref('TEXT' as ImportType);
const text = ref('');
const error = ref(false);
const errorMessage = ref('');
const plan = ref<GovBurnImportPlan | undefined>(undefined);
const naturalId = ref('');
const planetLabel = ref('');

function planetName(id: string) {
  return userData.govburn.planets[id]?.name ?? planetsStore.find(id)?.name ?? id;
}

function formatCountMaterials(count: number, materials: string[]) {
  if (count === -1) {
    return '--';
  }
  if (materials.length === 0) {
    return String(count);
  }
  return `${count} (${materials.join(', ')})`;
}

function rowNote(row: GovBurnImportRow) {
  const notes: string[] = [];
  if (row.omitted) {
    notes.push('not in import');
  }
  if (row.clamped) {
    notes.push(`clamped to ${row.count} upkeeps`);
  }
  if (row.unknownMaterials.length > 0) {
    notes.push(`not an upkeep: ${row.unknownMaterials.join(', ')}`);
  }
  return notes.join('; ');
}

function applyJson(json: unknown) {
  const input = parseGovBurnImport(json);
  if (input === undefined) {
    error.value = true;
    errorMessage.value = 'Invalid JSON.';
    return;
  }
  const planet = planetsStore.find(input.planet);
  if (planet === undefined) {
    error.value = true;
    errorMessage.value = 'Planet not found.';
    return;
  }
  error.value = false;
  errorMessage.value = '';
  naturalId.value = planet.naturalId;
  planetLabel.value = planetName(planet.naturalId);
  plan.value = buildImportPlan(
    input,
    userData.govburn.planets[planet.naturalId],
    userData.govburn.config.planets[planet.naturalId],
    userData.govburn.config.slots[planet.naturalId],
  );
}

function onPreviewClick() {
  if (text.value.length === 0) {
    error.value = true;
    errorMessage.value = 'Invalid JSON.';
    return;
  }
  try {
    applyJson(JSON.parse(text.value));
  } catch {
    error.value = true;
    errorMessage.value = 'Invalid JSON.';
  }
}

function onUploadClick() {
  uploadJson(applyJson);
}

function onBack() {
  plan.value = undefined;
  error.value = false;
  errorMessage.value = '';
}

function onConfirm() {
  const currentPlan = plan.value;
  const id = naturalId.value;
  if (currentPlan === undefined || id === '') {
    return;
  }
  userData.govburn.config.planets[id] ??= Object.fromEntries(
    popiBuildings.map(x => [x.ticker, -1]),
  );
  const planetConfig = userData.govburn.config.planets[id];
  const slots = (userData.govburn.config.slots[id] ??= {});
  for (const row of currentPlan.rows) {
    planetConfig[row.ticker] = row.count;
    if (row.materials.length === 0) {
      delete slots[row.ticker];
    } else {
      slots[row.ticker] = row.materials;
    }
  }
  emit('done');
}
</script>

<template>
  <div v-if="plan === undefined">
    <SectionHeader>Import GovBurn Plan</SectionHeader>
    <form @submit.prevent>
      <Active label="Type">
        <SelectInput v-model="type" :options="typeOptions" />
      </Active>
      <Active v-if="type === 'TEXT'" label="JSON" :error="error">
        <textarea
          v-model="text"
          :class="[C.TextareaInput.textarea, $style.textarea]"
          placeholder='{"planet":"Phobos","buildings":[{"building":"SST","materials":["DW","OFF"]}]}'
          spellcheck="false" />
      </Active>
      <Commands>
        <PrunButton v-if="type === 'FILE'" primary @click="onUploadClick">UPLOAD</PrunButton>
        <PrunButton v-if="type === 'TEXT'" primary @click="onPreviewClick">PREVIEW</PrunButton>
        <PrunButton @click="emit('done')">CANCEL</PrunButton>
      </Commands>
    </form>
    <p v-if="error" :class="$style.error">{{ errorMessage }}</p>
  </div>

  <div v-else>
    <SectionHeader>{{ planetLabel }}</SectionHeader>
    <p v-if="plan.hasConflicts" :class="$style.error">
      Overwrites existing settings for the highlighted rows.
    </p>
    <p v-if="!plan.hasData" :class="$style.note">
      No data captured for this planet. Materials cannot be validated - run XIT GOVBURNDATA.
    </p>
    <p v-if="plan.ignored.length > 0" :class="$style.note">
      Ignored (not POPI buildings): {{ plan.ignored.join(', ') }}.
    </p>
    <table>
      <thead>
        <tr>
          <th>Building</th>
          <th>Current</th>
          <th>New</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in plan.rows" :key="row.ticker" :class="{ [$style.conflict]: row.conflict }">
          <td>{{ row.ticker }}</td>
          <td>{{ formatCountMaterials(row.currentCount, row.currentMaterials) }}</td>
          <td>{{ formatCountMaterials(row.count, row.materials) }}</td>
          <td>{{ rowNote(row) }}</td>
        </tr>
      </tbody>
    </table>
    <form @submit.prevent>
      <Commands>
        <PrunButton primary @click="onConfirm">CONFIRM</PrunButton>
        <PrunButton @click="onBack">BACK</PrunButton>
      </Commands>
    </form>
  </div>
</template>

<style module>
.textarea {
  width: 100%;
  min-height: 80px;
  resize: vertical;
}

.error {
  margin: 0.25rem 0;
  color: rgb(217, 83, 79);
}

.note {
  margin: 0.25rem 0;
}

.conflict {
  color: rgb(217, 83, 79);
}
</style>
