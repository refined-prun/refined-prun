<script setup lang="ts">
import NoteList from '@src/features/XIT/NOTE/NoteList.vue';
import NoteEditor from '@src/features/XIT/NOTE/NoteEditor.vue';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { userData } from '@src/store/user-data';
import { isEmpty } from 'ts-extras';
import PrunButton from '@src/components/PrunButton.vue';
import { createId } from '@src/store/create-id';

const parameters = useXitParameters();
const name = parameters.join(' ');
const note = computed(() => {
  const byId = userData.notes.find(x => x.id.startsWith(parameters[0]));
  if (byId) {
    return byId;
  }
  return userData.notes.find(x => x.name === name);
});

function onCreateClick() {
  userData.notes.push({
    id: createId(),
    name,
    text: '',
  });
}
</script>

<template>
  <NoteList v-if="isEmpty(parameters)" />
  <NoteEditor v-else-if="note" :note="note" />
  <div v-else :class="$style.create">
    <span>Note "{{ name }}" not found.</span>
    <PrunButton primary :class="$style.button" @click="onCreateClick">CREATE</PrunButton>
  </div>
</template>

<style module>
.create {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.button {
  margin-top: 5px;
}
</style>
