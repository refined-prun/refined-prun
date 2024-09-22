<script lang="ts">
import xit from '@src/features/XIT/xit-registry';
import GIF from '@src/features/XIT/GIF.vue';

xit.add({
  command: 'GIF',
  name: 'RANDOM GIF',
  component: () => GIF,
});
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';

const props = defineProps({
  parameters: {
    type: Array<string>,
    required: true,
  },
});

const isLoading = ref(false);
const url = ref<string | undefined>();

async function load() {
  if (isLoading.value) {
    return;
  }
  isLoading.value = true;
  url.value = undefined;
  let rawUrl = 'https://api.giphy.com/v1/gifs/random?api_key=0UTRbFtkMxAplrohufYco5IY74U8hOes';
  const tag = props.parameters[1];
  if (tag) {
    rawUrl += '&tag=' + tag;
  }
  try {
    const response = await (await fetch(encodeURI(rawUrl))).json();
    url.value = response.data.images.original.webp;
  } catch (e) {
    console.error(e);
    url.value = '';
  }
}

function onLoad() {
  isLoading.value = false;
}

onMounted(() => void load());
</script>

<template>
  <LoadingSpinner v-if="isLoading" />
  <div :class="$style.container">
    <img :class="$style.image" :src="url" alt="gif" @click="load" @load="onLoad" @error="onLoad" />
  </div>
</template>

<style module>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image {
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}
</style>
