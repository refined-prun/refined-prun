<script setup lang="ts">
import Commands from '@src/components/forms/Commands.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { useTile } from '@src/hooks/use-tile';
import {
  ContractDraftSpec,
  MaterialEntry,
  describeSpecFields,
  specHasContractFields,
  summarize,
} from './parsers';
import DragImport from './DragImport.vue';
import { parserOptions } from './parser-options';
import { importSpec, isLoanTemplate, readDraftSpec } from './draft-form';
import $style from './contd-import-export.module.css';

const { exportTarget } = defineProps<{
  exportTarget: HTMLElement;
}>();

const tile = useTile();

const dragTabId = 'drag';
const activeParserStorageKey = 'rprun-contd-import-export-active';

// An empty stored value means hidden; only an absent value uses the default.
const activeParser = ref(localStorage.getItem(activeParserStorageKey) ?? parserOptions[0].id);
watch(activeParser, value => localStorage.setItem(activeParserStorageKey, value));

// Restore the last visible tab when Show is clicked.
const lastVisibleTabKey = 'rprun-contd-import-export-last-tab';
const lastVisibleTab = ref(localStorage.getItem(lastVisibleTabKey) ?? parserOptions[0].id);
watch(activeParser, value => {
  if (value) {
    lastVisibleTab.value = value;
    localStorage.setItem(lastVisibleTabKey, value);
  }
});

const textInstances = parserOptions.map(parser => {
  const text = ref('');
  const parsed = computed(() => parser.parse(text.value));
  const status = computed(() => summarize(parsed.value));
  const isInvalid = computed(() => parsed.value.error !== undefined);
  const canImport = computed(
    () =>
      !parsed.value.error &&
      (parsed.value.spec.materials.length > 0 || specHasContractFields(parsed.value.spec)),
  );
  const spec = computed(() => parsed.value.spec);
  return { kind: 'text' as const, ...parser, text, spec, status, isInvalid, canImport };
});

const dragMaterials = ref<MaterialEntry[]>([]);
const dragStatus = computed(() =>
  dragMaterials.value.length > 0
    ? `${dragMaterials.value.length} material${dragMaterials.value.length === 1 ? '' : 's'} ready.`
    : '',
);
const dragInstance = {
  kind: 'drag' as const,
  id: dragTabId,
  label: 'Drag',
  spec: computed<ContractDraftSpec>(() => ({ materials: dragMaterials.value })),
  status: dragStatus,
  isInvalid: computed(() => false),
  canImport: computed(() => dragMaterials.value.length > 0),
};

const tabs = [...textInstances, dragInstance];
const active = computed(() => tabs.find(tab => tab.id === activeParser.value));

const importIssues = ref<string[] | undefined>();
const exportStatus = ref('');
watch(active, () => {
  importIssues.value = undefined;
  exportStatus.value = '';
});
const importStatus = computed(() => {
  if (importIssues.value === undefined) {
    return '';
  }
  return importIssues.value.length === 0
    ? 'Imported.'
    : `Imported, but failed: ${importIssues.value.join(', ')}.`;
});

const importing = ref(false);
const onImport = async () => {
  const instance = active.value;
  if (!instance || importing.value || !instance.canImport.value) {
    return;
  }
  importing.value = true;
  importIssues.value = undefined;
  try {
    importIssues.value = await importSpec(tile.anchor, instance.spec.value);
  } finally {
    importing.value = false;
  }
};

// Keep the exported JSON visible if clipboard access fails.
const jsonInstance = textInstances[0];
const onExport = async () => {
  if (isLoanTemplate(tile.anchor)) {
    exportStatus.value = "Loan templates aren't supported.";
    return;
  }
  const spec = readDraftSpec(tile.anchor);
  const json = JSON.stringify(spec, null, 2);
  jsonInstance.text.value = json;
  activeParser.value = jsonInstance.id;
  const materials = spec.materials.length;
  const fields = describeSpecFields(spec).length;
  let clipboard: string;
  try {
    await navigator.clipboard.writeText(json);
    clipboard = 'copied to clipboard';
  } catch {
    clipboard = 'clipboard unavailable, copy from the box';
  }
  // Let the tab watcher clear the old status before setting the export result.
  await nextTick();
  exportStatus.value =
    `Exported ${materials} material${materials === 1 ? '' : 's'} + ` +
    `${fields} field${fields === 1 ? '' : 's'} - ${clipboard}.`;
};
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.tabRow">
      <div :class="$style.tabs">
        <PrunButton
          v-for="tab in tabs"
          :key="tab.id"
          :dark="activeParser !== tab.id"
          :primary="activeParser === tab.id"
          inline
          @click="activeParser = tab.id">
          {{ tab.label }}
        </PrunButton>
      </div>
      <PrunButton v-if="active" dark inline @click="activeParser = ''">Hide</PrunButton>
      <PrunButton v-else dark inline @click="activeParser = lastVisibleTab">Show</PrunButton>
    </div>
    <textarea
      v-if="active?.kind === 'text'"
      v-model="active.text.value"
      :class="[C.TextareaInput.textarea, $style.textarea]"
      :placeholder="active.placeholder" />
    <DragImport v-show="active?.kind === 'drag'" v-model="dragMaterials" />
    <div v-if="active" :class="$style.row">
      <PrunButton
        v-if="active.kind === 'text'"
        dark
        inline
        @click="active.text.value = active.example">
        Example
      </PrunButton>
      <div
        v-if="active.status.value"
        :class="[$style.status, C.type.typeSmall, active.isInvalid.value && C.colors.textDanger]"
        :data-tooltip="active.status.value">
        {{ active.status.value }}
      </div>
      <div
        v-if="importStatus"
        :class="[$style.status, C.type.typeSmall, importIssues!.length > 0 && C.colors.textDanger]"
        :data-tooltip="importStatus">
        {{ importStatus }}
      </div>
      <div
        v-if="exportStatus"
        :class="[$style.status, C.type.typeSmall]"
        :data-tooltip="exportStatus">
        {{ exportStatus }}
      </div>
      <PrunButton v-if="active.canImport.value" :disabled="importing" dark inline @click="onImport">
        Apply
      </PrunButton>
    </div>
  </div>
  <Teleport :to="exportTarget">
    <Commands label="Export" :class="$style.exportRow">
      <PrunButton dark inline @click="onExport">Export Template</PrunButton>
    </Commands>
  </Teleport>
</template>
