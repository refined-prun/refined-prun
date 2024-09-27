<script lang="ts">
import xit from '@src/features/XIT/xit-registry';
import NOTE from '@src/features/XIT/NOTE/NOTE.vue';

xit.add({
  command: ['NOTE', 'NOTES'],
  name: 'NOTE',
  component: () => NOTE,
});

export default {};
</script>

<script setup lang="ts">
import NoteList from '@src/features/XIT/NOTE/NoteList.vue';
import NoteEditor from '@src/features/XIT/NOTE/NoteEditor.vue';
import { computed } from 'vue';

const props = defineProps({
  parameters: {
    type: Array<string>,
    required: true,
  },
});

const noteName = computed(() =>
  props.parameters.length === 1 ? undefined : props.parameters.slice(1).join('_'),
);
</script>

<template>
  <div :style="{ height: '100%', flexGrow: 1, paddingTop: '4px' }">
    <NoteList v-if="!noteName" />
    <NoteEditor v-else :name="noteName!.split('_').join(' ')" />
  </div>
</template>
