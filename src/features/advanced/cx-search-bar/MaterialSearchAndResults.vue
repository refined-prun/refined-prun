<script setup lang="ts">
import TextInput from '@src/components/forms/TextInput.vue';
import { tickerToPrettyName } from './materials-pretty-names';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import RadioItem from '@src/components/forms/RadioItem.vue';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import classes from './cx-search-bar.module.css';
import css from '@src/utils/css-utils.module.css';
import onNodeDisconnected from '@src/utils/on-node-disconnected';

const { comExPanel } = defineProps<{
  comExPanel: HTMLElement;
}>();

const searchText = ref('');
let collapseText = searchText.value;
const collapseOthers = ref(false);
let collapseSearch = false;

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

watchEffectWhileNodeAlive(comExPanel, () => {
  const collapseOthersWithoutText = collapseOthers.value && collapseText.length !== 0;
  for (const option of optionElements.values()) {
    option.classList.toggle(
      css.hidden,
      !option.classList.contains(classes.matchingCategory) && collapseOthersWithoutText,
    );
  }
  for (const row of rowElements.values()) {
    if (row.isConnected) {
      row.classList.toggle(
        css.hidden,
        !row.classList.contains(classes.matchingRow) && collapseOthersWithoutText,
      );
    }
  }
  collapseSearch = collapseOthers.value;
});

const resetElement = (value: HTMLElement) => {
  if (value.isConnected) {
    value.classList.remove(classes.matchingCategory, classes.matchingRow);
    value.classList.toggle(css.hidden, collapseSearch && collapseText.length !== 0);
  }
};

// Main search loop.
watchEffectWhileNodeAlive(comExPanel, () => {
  const searchTerm = searchText.value.toUpperCase();
  collapseText = searchTerm;

  if (rowElements.size === 0) {
    loadRowElements();
    return;
  }

  optionElements.forEach(resetElement);
  rowElements.forEach(resetElement);

  if (searchTerm.length > 0) {
    for (const material of materialsStore.all.value!) {
      if (
        material.ticker.includes(searchTerm) ||
        tickerToPrettyName[material.ticker]?.toUpperCase().includes(searchTerm)
      ) {
        const optionElement = optionElements.get(material.category);
        if (optionElement) {
          optionElement.classList.add(classes.matchingCategory);
          optionElement.classList.toggle(css.hidden, !collapseSearch);
        }
        const rowElement = rowElements.get(material.ticker);
        if (rowElement && rowElement.isConnected) {
          rowElement.classList.add(classes.matchingRow);
          rowElement.classList.toggle(css.hidden, !collapseSearch);
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
    <RadioItem v-model="collapseOthers">Results Only</RadioItem>
  </div>
</template>

<style module>
.textInputElement {
  display: flex;
  align-items: center;
}
</style>
