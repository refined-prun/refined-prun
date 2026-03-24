<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import Commands from '@src/components/forms/Commands.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import { uploadJson } from '@src/utils/json-file';
import { isPresent } from 'ts-extras';

const { onImport } = defineProps<{ onImport: (json: UserData.ActionPackageData) => void }>();

const emit = defineEmits<{ (e: 'close'): void }>();

type ImportType = 'TEXT' | 'FILE';

const typeOptions: { label: string; value: ImportType }[] = [
  {
    label: 'Paste JSON',
    value: 'TEXT',
  },
  {
    label: 'Upload JSON',
    value: 'FILE',
  },
];

const type = ref('TEXT' as ImportType);
const text = ref('');
const error = ref(false);

function onImportClick() {
  if (text.value.length === 0) {
    error.value = true;
    return;
  }
  try {
    const json = JSON.parse(text.value);
    if (!validateJson(json)) {
      error.value = true;
      return;
    }
    onImport(json);
    emit('close');
  } catch {
    error.value = true;
  }
}

function onUploadClick() {
  uploadJson(json => {
    if (!validateJson(json)) {
      error.value = true;
      return;
    }
    onImport(json);
    emit('close');
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateJson(json: any) {
  return isPresent(json.global?.name);
}
</script>

<template>
  <div :class="C.DraftConditionEditor.form">
    <SectionHeader>Import Action Package</SectionHeader>
    <form>
      <Active label="Type">
        <SelectInput v-model="type" :options="typeOptions" />
      </Active>
      <Active v-if="type === 'TEXT'" label="JSON" :error="error">
        <TextInput v-model="text" focus-on-mount />
      </Active>
      <Commands>
        <PrunButton v-if="type === 'FILE'" primary @click="onUploadClick">UPLOAD</PrunButton>
        <PrunButton v-if="type === 'TEXT'" primary @click="onImportClick">IMPORT</PrunButton>
      </Commands>
    </form>
  </div>
</template>
