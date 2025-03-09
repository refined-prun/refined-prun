<script setup lang="ts">
import { onMounted } from 'vue';

defineProps<{ detail?: string }>();

const spanRef = useTemplateRef('span');

onMounted(() => queueMicrotask(fitDetail));
onUpdated(() => queueMicrotask(fitDetail));

function fitDetail() {
  const span = spanRef.value;
  const parent = span?.parentElement;
  if (!parent) {
    return;
  }
  const mainLabelFontSize = parent.clientWidth / 3;
  const maxWidth = parent.clientWidth * 0.85;
  const minSize = 7;
  const maxSize = Math.max(minSize, Math.floor(mainLabelFontSize * 0.65));
  span.style.fontSize = maxSize + 'px';
  if (span.clientWidth < maxWidth) {
    return;
  }
  span.style.fontSize = minSize + 'px';
  if (span.clientWidth > maxWidth) {
    while (span.clientWidth > maxWidth) {
      span.textContent = span.textContent?.slice(0, -1);
    }
    return;
  }

  span.style.fontSize = binarySearchFontSize(span, minSize, maxSize, maxWidth) + 'px';
}

function binarySearchFontSize(span: HTMLElement, low: number, high: number, maxWidth: number) {
  const precision = 1;

  while (high - low > precision) {
    const mid = Math.floor((low + high) / 2);
    span.style.fontSize = mid + 'px';

    if (span.clientWidth > maxWidth) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return Math.floor(low);
}
</script>

<template>
  <span v-if="detail" ref="span" :class="$style.detail">{{ detail }}</span>
</template>

<style module>
.detail {
  font-size: 7px;
  white-space: nowrap;
}
</style>
