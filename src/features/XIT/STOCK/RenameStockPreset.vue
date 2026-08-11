<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import Commands from '@src/components/forms/Commands.vue';
import { isValidPackageName } from '@src/features/XIT/ACT/utils';

const { name: initialName, onRename } = defineProps<{
  name: string;
  onRename: (name: string) => void;
}>();

const emit = defineEmits<{ (e: 'close'): void }>();

const name = ref(initialName);
const nameError = ref(false);
watch(name, () => (nameError.value = !isValidPackageName(name.value)));

function onRenameClick() {
  if (name.value.length === 0 || !isValidPackageName(name.value)) {
    nameError.value = true;
    return;
  }
  onRename(name.value);
  emit('close');
}
</script>

<template>
  <div :class="C.DraftConditionEditor.form">
    <SectionHeader>Rename Stock Preset</SectionHeader>
    <form>
      <Active label="Name" :error="nameError">
        <TextInput v-model="name" />
      </Active>
      <Commands>
        <PrunButton primary @click="onRenameClick">RENAME</PrunButton>
      </Commands>
    </form>
  </div>
</template>
