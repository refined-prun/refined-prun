<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import Commands from '@src/components/forms/Commands.vue';

const props = defineProps({
  onCreate: {
    type: Function as PropType<(name: string) => void>,
    required: true,
  },
});

const emit = defineEmits<{ (e: 'close'): void }>();

const name = ref('');

function onCreateClick() {
  if (name.value.length === 0) {
    return;
  }
  props.onCreate(name.value);
  emit('close');
}
</script>

<template>
  <div :class="C.DraftConditionEditor.form">
    <SectionHeader>New Task List</SectionHeader>
    <form>
      <Active label="Name">
        <TextInput v-model="name" />
      </Active>
      <Commands>
        <PrunButton primary @click="onCreateClick">CREATE</PrunButton>
      </Commands>
    </form>
  </div>
</template>
