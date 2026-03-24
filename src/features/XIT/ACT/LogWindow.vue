<script setup lang="ts">
import { objectId } from '@src/utils/object-id';
import { LogTag } from '@src/features/XIT/ACT/runner/logger';

const { messages, scrolling } = defineProps<{
  messages: { tag: LogTag; message: string }[];
  scrolling: boolean;
}>();

const $style = useCssModule();

const logElement = useTemplateRef('log');

watch(
  () => messages,
  () => {
    if (messages.length === 0 || !scrolling) {
      return;
    }
    if (logElement.value) {
      nextTick(() =>
        logElement.value?.scrollTo({ top: logElement.value.scrollHeight, behavior: 'smooth' }),
      );
    }
  },
  { deep: true },
);

function getTagClass(tag: LogTag) {
  switch (tag) {
    case 'ACTION':
    case 'SUCCESS':
      return $style.success;
    case 'WARNING':
    case 'SKIP':
      return $style.warning;
    case 'ERROR':
    case 'CANCEL':
      return $style.failure;
  }
  return undefined;
}
</script>

<template>
  <div ref="log" :class="[$style.log, C.fonts.fontRegular]">
    <div v-for="message in messages" :key="objectId(message)">
      <b v-if="message.tag" :class="getTagClass(message.tag)">{{ message.tag }}: </b>
      <span>{{ message.message }}</span>
    </div>
  </div>
</template>

<style module>
.log {
  margin-top: 5px;
  margin-left: 4px;
  overflow-y: scroll;
  font-size: 11px;
  line-height: 1.5;
  background-color: #23282b;
  color: #bbbbbb;
  border: 1px solid #2b485a;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
  }

  &:focus {
    outline: none;
  }
}

.success {
  color: #5cb85c;
}

.failure {
  color: #d9534f;
}

.warning {
  color: #f7a600;
}
</style>
