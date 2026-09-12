<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import Active from '@src/components/forms/Active.vue';
import TextInput from '@src/components/forms/TextInput.vue';
import Commands from '@src/components/forms/Commands.vue';
import { userData } from '@src/store/user-data';
import { createId } from '@src/store/create-id';
import { showSuccessOverlay } from '@src/infrastructure/prun-ui/tile-overlay';

const name = ref('');

onMounted(() => {
  name.value = `FLDR ${userData.tabs.folders.length + 1}`;
});

function onCreate(event: Event) {
  const trimmed = name.value.trim();
  if (!trimmed) {
    return;
  }
  const id = createId();
  userData.tabs.folders.push({ id, name: trimmed.toUpperCase(), screenIds: [] });
  userData.tabs.order.push(id);
  name.value = `FLDR ${userData.tabs.folders.length + 1}`;
  showSuccessOverlay(event);
}
</script>

<template>
  <form @submit.prevent="onCreate">
    <Active label="Folder Name">
      <TextInput v-model="name" :focus-on-mount="true" />
    </Active>
    <Commands>
      <PrunButton primary type="submit">CREATE</PrunButton>
    </Commands>
  </form>
</template>
