<script setup lang="ts">
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

const { inline, autoSubmit = true } = defineProps<{
  autoSubmit?: boolean;
  command?: string;
  href?: string;
  inline?: boolean;
}>();

const $style = useCssModule();
const classes = computed(() => ({
  [C.Link.link]: true,
  [$style.block]: !inline,
  [$style.inline]: inline,
}));
</script>

<template>
  <a v-if="href" :href="href" :class="classes" target="_blank" rel="noreferrer">
    <slot v-if="$slots.default"></slot>
    <template v-else>{{ href }}</template>
  </a>
  <div v-else :class="classes" @click.stop="() => showBuffer(command!, { autoSubmit })">
    <slot v-if="$slots.default"></slot>
    <template v-else>{{ command }}</template>
  </div>
</template>

<style module>
.block {
  display: block;
}

.inline {
  display: inline-block;
}
</style>
