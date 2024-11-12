<script setup lang="ts">
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { useXitParameters } from '@src/hooks/useXitParameters';

const parameters = useXitParameters();
const tag = parameters.join(' ');

const isLoading = ref(false);
const url = ref<string | undefined>();

async function load() {
  if (isLoading.value) {
    return;
  }
  isLoading.value = true;
  url.value = undefined;
  let rawUrl = 'https://api.giphy.com/v1/gifs/random?api_key=0UTRbFtkMxAplrohufYco5IY74U8hOes';
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
