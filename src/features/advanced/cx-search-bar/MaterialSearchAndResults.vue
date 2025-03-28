<script setup lang="ts">
import TextInput from '@src/components/forms/TextInput.vue';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import css from '@src/utils/css-utils.module.css';
import onNodeDisconnected from '@src/utils/on-node-disconnected';
import { getMaterialName } from '@src/infrastructure/prun-ui/i18n';
import fa from '@src/utils/font-awesome.module.css';
import PrunButton from '@src/components/PrunButton.vue';

const $style = useCssModule();

const { comExPanel } = defineProps<{
  comExPanel: HTMLElement;
}>();

const searchText = ref('');

const select = _$(comExPanel, 'select')!;
const selectValue = ref('');
select.addEventListener('change', () => {
  selectValue.value = select.value;
});

type TickerToElement = Map<string, HTMLElement>;
const optionElements: TickerToElement = new Map();
const rowElements: TickerToElement = new Map();

if (optionElements.size === 0) {
  const options = _$$(comExPanel, 'option')!;
  for (const option of options) {
    optionElements.set(option.getAttribute('value')!, option);
  }
}

function loadRowElements() {
  const currentTBody = _$(comExPanel, 'tbody');
  if (!currentTBody) {
    return;
  }
  const rows = _$$(currentTBody, 'tr');
  for (const row of rows) {
    const labelText = _$(row, C.ColoredIcon.label)!.innerText;
    rowElements.set(labelText, row);
  }
  triggerRef(searchText);
}

// If CX loads a category it's already seen, it loads the data from memory and only tr's will be changed.
const selectValueWatch = watch(selectValue, () => {
  loadRowElements();
});
onNodeDisconnected(comExPanel, selectValueWatch);

// If CX loads a category it hasn't fetched from the server yet, a new tbody will be generated.
subscribe($$(comExPanel, 'tbody'), () => {
  loadRowElements();
});

const resetMatches = (value: HTMLElement) => {
  if (value.isConnected) {
    value.classList.toggle(css.hidden, searchText.value.length !== 0);
  }
};

// Main search loop.
watchEffectWhileNodeAlive(comExPanel, () => {
  const searchTerm = searchText.value.toUpperCase();

  if (rowElements.size === 0) {
    loadRowElements();
    return;
  }

  optionElements.forEach(resetMatches);
  rowElements.forEach(resetMatches);

  if (searchTerm.length > 0) {
    for (const material of materialsStore.all.value!) {
      if (
        material.ticker.includes(searchTerm) ||
        getMaterialName(material)?.toUpperCase().includes(searchTerm)
      ) {
        const optionElement = optionElements.get(material.category);
        if (optionElement) {
          optionElement.classList.remove(css.hidden);
        }
        const rowElement = rowElements.get(material.ticker);
        if (rowElement && rowElement.isConnected) {
          rowElement.classList.remove(css.hidden);
        }
      }
    }
  }
});
</script>

<template>
  <div :class="[C.ActionBar.element, $style.textInputElement]">
    Search:
    <TextInput v-model="searchText" />
    <PrunButton :class="$style.button" dark @click="searchText = ''">
      <i :class="fa.solid">{{ '\uf00d' }} </i>
    </PrunButton>
  </div>
</template>

<style module>
.textInputElement {
  display: flex;
  align-items: center;
}

.button {
  width: 18px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  margin-left: 2px;
  height: 18px;
}
</style>
