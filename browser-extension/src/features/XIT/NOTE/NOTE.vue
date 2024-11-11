<script setup lang="ts">
import NoteList from '@src/features/XIT/NOTE/NoteList.vue';
import NoteEditor from '@src/features/XIT/NOTE/NoteEditor.vue';
import { useXitParameters } from '@src/hooks/useXitParameters';
import { computed } from 'vue';
import { userData } from '@src/store/user-data';
import { isEmpty } from 'ts-extras';

const parameters = useXitParameters();
const note = computed(() => {
  const byId = userData.notes.find(x => x.id.startsWith(parameters[0]));
  if (byId) {
    return byId;
  }
  const name = parameters.join(' ');
  return userData.notes.find(x => x.name === name);
});
</script>

<template>
  <NoteList v-if="isEmpty(parameters)" />
  <NoteEditor v-else-if="note" :note="note" />
  <div v-else>Note not found.</div>
</template>
