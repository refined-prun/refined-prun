<script setup lang="ts">
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

const { inline, autoSubmit = true } = defineProps<{
  autoSubmit?: boolean;
  command?: string;
  commandText?: string;
  href?: string;
  inline?: boolean;
}>();

const $style = useCssModule();
const classes = computed(() => ({
  [$style.link]: true,
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
    <template v-else>{{ commandText ? commandText : command }}</template>
  </div>
</template>

<style module>
.link {
  color: #3fa2de;
  cursor: pointer;
  display: block;
}

.inline {
  display: inline-block;
}

.link:hover {
  color: #f7a600 !important;
}
</style>
