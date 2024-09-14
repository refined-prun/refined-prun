<script setup lang="ts">
import { computed } from 'vue';
import { useCssModule } from 'vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

const props = defineProps({
  inline: Boolean,
  href: {
    type: String,
    required: false,
    default: undefined,
  },
  command: {
    type: String,
    required: false,
    default: undefined,
  },
});

const $style = useCssModule();
const classes = computed(() => ({
  [$style.link]: true,
  [$style.inline]: props.inline,
}));
</script>

<template>
  <a v-if="href" :href="href" :class="classes" target="_blank" rel="noreferrer">
    <slot v-if="$slots.default"></slot>
    <template v-else>{{ href }}</template>
  </a>
  <div v-else :class="classes" @click="() => showBuffer(command!)">
    <slot v-if="$slots.default"></slot>
    <template v-else>{{ command }}</template>
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
