<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import Commands from '@src/components/forms/Commands.vue';
import { isValidPackageName } from '@src/features/XIT/ACT/utils';

const { onCreate } = defineProps<{ onCreate: (name: string) => void }>();

const emit = defineEmits<{ (e: 'close'): void }>();

const name = ref('');
const nameError = ref(false);
watch(name, () => (nameError.value = !isValidPackageName(name.value)));

function onCreateClick() {
  if (name.value.length === 0 || !isValidPackageName(name.value)) {
    nameError.value = true;
    return;
  }
  onCreate(name.value);
  emit('close');
}
</script>

<template>
  <div :class="C.DraftConditionEditor.form">
    <SectionHeader>Create Action Package</SectionHeader>
    <form>
      <Active label="Name" :error="nameError">
        <TextInput v-model="name" />
      </Active>
      <Commands>
        <PrunButton primary @click="onCreateClick">CREATE</PrunButton>
      </Commands>
    </form>
  </div>
</template>
