<script setup lang="ts">
import PrunLink from '@src/components/PrunLink.vue';

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});

interface Part {
  text?: string;
  command?: string;
}

const parts = computed(() => {
  const parts: Part[] = [];
  let text = props.text;
  const matches = [...text.matchAll(/\[\[([a-zA-Z]):([^:\]]+)]]/g)];
  let cut = 0;
  for (const match of matches) {
    const before = text.substring(0, match.index - cut);
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
    text = text.slice(match.index + match[0].length - cut);
    cut = match.index + match[0].length;
  }

  if (text.length > 0) {
    parts.push({ text });
  }
  return parts;
});
</script>

<template>
  <div>
    <template v-for="part in parts" :key="part.text + part.command">
      <PrunLink v-if="part.command" inline :command="part.command">{{ part.text }}</PrunLink>
      <span v-else>{{ part.text }}</span>
    </template>
  </div>
</template>
