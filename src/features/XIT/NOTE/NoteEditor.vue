<script setup lang="ts">
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import Header from '@src/components/Header.vue';

const { note } = defineProps<{ note: UserData.Note }>();

const $style = useCssModule();

const renderedText = computed(() => processText(note.text));

function processText(text?: string) {
  if (text === undefined) {
    return '';
  }

  // Account for final new lines
  if (text[text.length - 1] == '\n') {
    text += ' ';
  }

  // Allow for HTML tags
  text = text.replaceAll('&', '&amp;').replaceAll('<', '&lt;');

  const regexp = /\b(?:[a-zA-Z0-9]{1,3}\.(?:CI1|IC1|AI1|NC1|CI2|NC2))(?!<)/g;
  let counter = 0;
  while (true) {
    const matches = text.match(regexp);
    if (!matches) {
      break;
    }

    text = text.replaceAll(regexp, function (match) {
      return `<span class="${C.Link.link} ${$style.link}">${match}</span>`;
    });

    counter++;
    if (counter > 100) {
      break;
    }
  }
  return text;
}

const textbox = useTemplateRef<HTMLTextAreaElement>('textbox');
const overlay = useTemplateRef<HTMLPreElement>('overlay');

onMounted(() => {
  textbox.value!.addEventListener('scroll', () => {
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
  <Header v-model="note.name" editable :class="$style.header" />
  <div :class="$style.header">{{ note.name }}</div>
  <div>
    <textarea ref="textbox" v-model="note.text" :class="$style.textarea" spellcheck="false" />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <pre ref="overlay" :class="$style.overlay" v-html="renderedText" />
  </div>
</template>

<style module>
.header {
  padding-top: 5px;
  margin-left: 10px;
  margin-bottom: 2px;
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
  position: relative;
  z-index: 2;
}
</style>
