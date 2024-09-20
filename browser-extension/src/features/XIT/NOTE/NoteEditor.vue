<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useCssModule, watch } from 'vue';
import { notes } from '@src/store/notes';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const $style = useCssModule();

const note = computed(() => notes.notes.find(x => x[0] === props.name));

const text = computed({
  get: () => note.value?.[1] ?? '',
  set: value => {
    if (value.length === 0) {
      notes.notes = notes.notes.filter(x => x[0] !== props.name);
      return;
    }
    let savedNote = note.value;
    if (!savedNote) {
      savedNote = [props.name, value];
      notes.notes.push(savedNote);
    } else {
      savedNote[1] = value;
    }
  },
});

const renderedText = computed(() => processText(text.value));

function processText(text: string) {
  // Account for final new lines
  if (text[text.length - 1] == '\n') {
    text += ' ';
  }

  // Allow for HTML tags
  text = text.replaceAll('&', '&amp;').replaceAll('<', '&lt;');

  const regexp = /\b(?:[a-zA-Z0-9]{1,3}\.(?:CI1|IC1|AI1|NC1|CI2|NC2))(?!<)/;
  let counter = 0;
  while (true) {
    const matches = text.match(regexp);
    if (!matches) {
      break;
    }

    text = text.replaceAll(regexp, `<span class="${$style.link}">${matches[0]}</span>`);

    counter++;
    if (counter > 100) {
      break;
    }
  }
  return text;
}

const textbox = ref<HTMLTextAreaElement | null>(null);
const overlay = ref<HTMLPreElement | null>(null);

onMounted(() => {
  if (!textbox.value || !overlay.value) {
    return;
  }
  textbox.value.addEventListener('scroll', () => {
    overlay.value!.scrollTop = textbox.value!.scrollTop;
    overlay.value!.scrollLeft = textbox.value!.scrollLeft;
  });
});

watch(
  renderedText,
  async () => {
    await nextTick();
    const links = overlay.value?.getElementsByClassName($style.link) ?? [];
    for (const link of Array.from(links)) {
      link.addEventListener('click', () => {
        showBuffer(`CXPO ${link.textContent}`);
      });
    }
  },
  { immediate: true },
);
</script>

<template>
  <div :class="['title', $style.title]" :style="{ paddingLeft: '10px' }">{{ name }}</div>
  <div>
    <textarea ref="textbox" v-model="text" :class="$style.textarea" spellcheck="false" />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <pre ref="overlay" :class="$style.overlay" v-html="renderedText" />
  </div>
</template>

<style module>
.title {
  padding-top: 5px;
}

.textarea {
  color: transparent;
  background: transparent;
  caret-color: white;
  margin: 10px;
  padding: 10px;
  border: 0;
  width: calc(100% - 20px);
  height: calc(100% - 20px - 20px);
  position: absolute;
  top: 20px;
  left: 0;
  overflow-y: scroll;
  font-family: 'Droid Sans', sans-serif;
  font-size: 13px;
  line-height: 1.5;
  tab-size: 4;
  resize: none;
  z-index: 1;
}

.textarea:focus {
  outline: none;
}

.textarea::-webkit-scrollbar {
  width: 0;
}

.overlay {
  background-color: #42361d;
  color: #cccccc;
  margin: 10px;
  padding: 10px;
  border: 0;
  width: calc(100% - 20px);
  height: calc(100% - 20px - 20px);
  position: absolute;
  top: 20px;
  left: 0;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  overflow-y: scroll;
  font-family: 'Droid Sans', sans-serif;
  font-size: 13px;
  line-height: 1.5;
  tab-size: 4;
}

.overlay::-webkit-scrollbar {
  width: 0;
}

.link {
  color: #3fa2de;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.link:hover {
  color: #f7a600;
}
</style>
