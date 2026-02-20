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

const container = useTemplateRef<HTMLDivElement>('container');
const wrap = useTemplateRef<HTMLDivElement>('wrap');
const image = useTemplateRef<HTMLImageElement>('image');

onMounted(() => void load());

watchEffect(() => image.value?.addEventListener('load', layout));
watchEffect(() => {
  if (container.value) {
    new ResizeObserver(layout).observe(container.value);
  }
});

function layout() {
  const maxW = container.value!.clientWidth;
  const maxH = container.value!.clientHeight;

  let nw = image.value!.naturalWidth;
  if (nw === 0) {
    nw = 1;
  }
  let nh = image.value!.naturalHeight;
  if (nh === 0) {
    nh = 1;
  }
  const ar = nw / nh;

  let w = maxW;
  let h = w / ar;

  if (h > maxH) {
    h = maxH;
    w = h * ar;
  }

  wrap.value!.style.width = `${w}px`;
  wrap.value!.style.height = `${h}px`;
}
</script>

<template>
  <LoadingSpinner v-if="isLoading" />
  <div ref="container" :class="$style.container">
    <div ref="wrap" :class="$style.wrap">
      <img
        ref="image"
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

.wrap {
  position: relative;
}

.image {
  width: 100%;
  height: 100%;
  display: block;
  cursor: pointer;
}

.watermark {
  position: absolute;
  bottom: 4px;
  left: 4px;
  width: 40px;
  opacity: 75%;
  pointer-events: none;
}
</style>
