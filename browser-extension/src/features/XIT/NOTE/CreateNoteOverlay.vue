<script setup lang="ts">
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { PropType, ref } from 'vue';
import PrunButton from '@src/components/PrunButton.vue';
import SectionHeader from '@src/components/SectionHeader.vue';
import ActiveFormElement from '@src/components/forms/ActiveFormElement.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import CommandFormElement from '@src/components/forms/CommandFormElement.vue';

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
  <div :class="PrunCss.DraftConditionEditor.form">
    <SectionHeader>New Note</SectionHeader>
    <form>
      <ActiveFormElement
        label="Note Name"
        tooltip="The name of the note. The command to access will be XIT NOTE_{name}">
        <TextInput v-model="name" />
      </ActiveFormElement>
      <CommandFormElement>
        <PrunButton primary @click="onCreateClick">CREATE</PrunButton>
      </CommandFormElement>
    </form>
  </div>
</template>
