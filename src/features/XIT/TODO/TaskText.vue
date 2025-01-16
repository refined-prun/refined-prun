<script setup lang="ts">
import PrunLink from '@src/components/PrunLink.vue';
import { objectId } from '@src/utils/object-id';

const { text } = defineProps<{ text?: string }>();

interface Part {
  text?: string;
  command?: string;
}

const parts = computed(() => {
  const parts: Part[] = [];
  let processed = text;
  if (!processed) {
    return parts;
  }
  const matches = [...processed.matchAll(/\[\[([a-zA-Z]):([^:\]]+)]]/g)];
  let cut = 0;
  for (const match of matches) {
    const before = processed.substring(0, match.index - cut);
    if (before.length > 0) {
      parts.push({ text: before });
    }
    switch (match[1]) {
      case 'm':
        parts.push({ text: match[2], command: `MAT ${match[2]}` });
        break;
      case 'p':
        parts.push({ text: match[2], command: `BS ${match[2]}` });
        break;
      default:
        parts.push({ text: match[0] });
        break;
    }
    processed = processed.slice(match.index + match[0].length - cut);
    cut = match.index + match[0].length;
  }

  if (processed.length > 0) {
    parts.push({ text: processed });
  }
  return parts;
});
</script>

<template>
  <div>
    <template v-for="part in parts" :key="objectId(part)">
      <PrunLink v-if="part.command" inline :command="part.command">{{ part.text }}</PrunLink>
      <span v-else>{{ part.text }}</span>
    </template>
  </div>
</template>
