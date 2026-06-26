<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import Commands from '@src/components/forms/Commands.vue';
import { isValidPackageName } from '@src/features/XIT/ACT/utils';

const { name, onRename } = defineProps<{ name: string; onRename: (name: string) => void }>();

const emit = defineEmits<{ (e: 'close'): void }>();

const newName = ref(name);
const nameError = ref(false);
watch(newName, () => (nameError.value = !isValidPackageName(newName.value)));

function onCreateClick() {
  if (newName.value.length === 0 || !isValidPackageName(newName.value)) {
    nameError.value = true;
    return;
  }
  onRename(newName.value);
  emit('close');
}
</script>

<template>
  <div :class="C.DraftConditionEditor.form">
    <SectionHeader>Rename Action Package</SectionHeader>
    <div :class="$style.description">
      WARNING: Renaming an action package will break all existing tile links to it (including this
      one). You can see the full list of your action packages in XIT ACT.
    </div>
    <form>
      <Active label="Name" :error="nameError">
        <TextInput v-model="newName" />
      </Active>
      <Commands>
        <PrunButton primary @click="onCreateClick">RENAME</PrunButton>
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
