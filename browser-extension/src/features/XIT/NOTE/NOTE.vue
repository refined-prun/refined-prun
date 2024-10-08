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
import { useXitParameters } from '@src/hooks/useXitParameters';

const parameters = useXitParameters();
const noteId = parameters[0];
</script>

<template>
  <div :style="{ height: '100%', flexGrow: 1, paddingTop: '4px' }">
    <NoteList v-if="!noteId" />
    <NoteEditor v-else :id="noteId" />
  </div>
</template>
