<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import Commands from '@src/components/forms/Commands.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import { act } from '@src/features/XIT/ACT/act-registry';

const { add, action, onSave, pkg } = defineProps<{
  add?: boolean;
  action: UserData.ActionData;
  onSave?: () => void;
  pkg: UserData.ActionPackageData;
}>();

const emit = defineEmits<{ (e: 'close'): void }>();

const name = ref(action.name ?? '');
const nameError = ref(false);

const typeOptions = act.getActionTypes();
const type = ref(action.type);

const shortDescription = computed(() => act.getActionInfo(type.value)?.shortDescription);
const editFormComponent = computed(() => act.getActionInfo(type.value)?.editComponent);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const editForm = useTemplateRef<any>('editForm');

function onSaveClick() {
  let isValid = editForm.value.validate();
  nameError.value = name.value.length === 0;
  isValid &&= !nameError.value;
  if (!isValid) {
    return;
  }
  for (const key of Object.keys(action)) {
    delete action[key];
  }
  editForm.value.save();
  action.name = name.value;
  action.type = type.value;
  onSave?.();
  emit('close');
}
</script>

<template>
  <div :class="C.DraftConditionEditor.form">
    <SectionHeader>{{ add ? 'Add' : 'Edit' }} Action</SectionHeader>
    <div v-if="shortDescription" :class="$style.description">{{ shortDescription }}</div>
    <form>
      <Active label="Type">
        <SelectInput v-model="type" :options="typeOptions" />
      </Active>
      <Active label="Name" :error="nameError">
        <TextInput v-model="name" />
      </Active>
      <Component
        :is="editFormComponent"
        v-if="editFormComponent"
        ref="editForm"
        :action="action"
        :pkg="pkg" />
      <Commands>
        <PrunButton primary @click="onSaveClick">{{ add ? 'ADD' : 'SAVE' }}</PrunButton>
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
