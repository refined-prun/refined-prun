<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import Commands from '@src/components/forms/Commands.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';
import { act } from '@src/features/XIT/ACT/act-registry';

const { add, group, onSave } = defineProps<{
  add?: boolean;
  group: UserData.MaterialGroupData;
  onSave?: () => void;
}>();

const emit = defineEmits<{ (e: 'close'): void }>();

const name = ref(group.name || '');
const nameError = ref(false);

const typeOptions = act.getMaterialGroupTypes();
const type = ref(group.type);

const editFormComponent = computed(() => act.getMaterialGroupInfo(type.value)?.editComponent);
const editForm = useTemplateRef('editForm');

function onSaveClick() {
  let isValid = editForm.value.validate();
  nameError.value = name.value.length === 0;
  isValid &&= !nameError.value;
  if (!isValid) {
    return;
  }
  for (const key of Object.keys(group)) {
    delete group[key];
  }
  editForm.value.save();
  group.name = name.value;
  group.type = type.value;
  onSave?.();
  emit('close');
}
</script>

<template>
  <div :class="C.DraftConditionEditor.form">
    <SectionHeader>{{ add ? 'Add' : 'Edit' }} Material Group</SectionHeader>
    <form>
      <Active label="Type">
        <SelectInput v-model="type" :options="typeOptions" />
      </Active>
      <Active label="Name" :error="nameError">
        <TextInput v-model="name" />
      </Active>
      <Component :is="editFormComponent" v-if="editFormComponent" ref="editForm" :group="group" />
      <Commands>
        <PrunButton primary @click="onSaveClick">{{ add ? 'ADD' : 'SAVE' }}</PrunButton>
      </Commands>
    </form>
  </div>
</template>
