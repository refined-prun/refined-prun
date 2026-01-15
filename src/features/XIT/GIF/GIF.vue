<script setup lang="ts">
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { getGifUrl } from '@src/features/XIT/GIF/gif-provider';

const parameters = useXitParameters();
const tag = parameters.join(' ');

const isLoading = ref(false);
const url = ref<string | undefined>();

async function load() {
  if (isLoading.value) {
    return;
  }
  isLoading.value = true;
  url.value = (await getGifUrl(tag)) ?? '';
}

function onLoad() {
  isLoading.value = false;
}

onMounted(() => void load());
</script>

<template>
  <LoadingSpinner v-if="isLoading" />
  <div :class="$style.container">
    <div :class="$style.imageWrapper">
      <img
        :class="$style.image"
        :src="url"
        alt="gif"
        @click="load"
        @load="onLoad"
        @error="onLoad" />
      <img
        src="https://refined-prun.github.io/assets/klipy.png"
        alt="Klipy"
        :class="$style.watermark" />
    </div>
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

.imageWrapper {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image {
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}

.watermark {
  position: absolute;
  bottom: 4px;
  left: 4px;
  width: 40px;
  opacity: 75%;
}
</style>
