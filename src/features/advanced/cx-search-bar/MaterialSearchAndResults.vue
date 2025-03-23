<script setup lang="ts">
import TextInput from '@src/components/forms/TextInput.vue';
import { searchForTickerFromSubstring } from './materials-pretty-names';
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
const collapseOthers = ref(false);
let searchCollapse = false;

const select = _$(comExPanel, 'select')!;
const selectValue = ref('');
select.addEventListener('change', () => {
  selectValue.value = select.value;
});

const options = _$$(comExPanel, 'option')!;
const optionElements: { [category: string]: { element: HTMLOptionElement; changed: boolean } } = {};
options.every(
  option => (optionElements[option.getAttribute('value')!] = { element: option, changed: false }),
);

const rowElements: { [ticker: string]: { element: HTMLTableRowElement; changed: boolean } } = {};

// If CX loads a category it hasn't fetched from the server yet, a new tbody will be generated.
// If CX loads a category it's already seen, it loads the data from memory and only tr's will be changed.
// This subscribe/watch combo account for both instances.
subscribe($$(comExPanel, 'tbody'), tbody => {
  const selectValueWatch = watch(
    selectValue,
    () => {
      const currentTBody = _$(comExPanel, 'tbody');
      if (!currentTBody) {
        return;
      }
      Object.keys(rowElements).forEach(key => {
        delete rowElements[key];
      });
      const rows = _$$(currentTBody, 'tr');
      for (const row of rows) {
        const labelText = _$(row, C.ColoredIcon.label)!.innerText;
        rowElements[labelText] = { element: row, changed: false };
      }
      triggerRef(searchText);
    },
    { immediate: true },
  );
  onNodeDisconnected(tbody, selectValueWatch);
});

watchEffectWhileNodeAlive(comExPanel, () => {
  Object.values(optionElements).forEach(option =>
    option.element.classList.toggle(css.hidden, !option.changed && collapseOthers.value),
  );
  Object.values(rowElements).forEach(row =>
    row.element.classList.toggle(css.hidden, !row.changed && collapseOthers.value),
  );
  searchCollapse = collapseOthers.value;
});

watchEffectWhileNodeAlive(comExPanel, () => {
  Object.values(optionElements).forEach(option => {
    option.changed = false;
  });
  Object.values(rowElements).forEach(row => {
    row.changed = false;
  });

  if (searchText.value && searchText.value.length > 0) {
    const search = searchForTickerFromSubstring(searchText.value) ?? [];
    for (const ticker of search) {
      const material = materialsStore.getByTicker(ticker)!;

      const optionElement = optionElements[material.category];
      if (optionElement) {
        optionElement.changed = true;
      }

      const rowElement = rowElements[material.ticker];
      if (rowElement) {
        rowElement.changed = true;
      }
    }
  }

  Object.values(optionElements).forEach(option => {
    toggleClasses(option.element, classes.matchingCategory, option.changed);
  });
  Object.values(rowElements).forEach(row => {
    toggleClasses(row.element, classes.matchingRow, row.changed);
  });
});

function toggleClasses(
  element: HTMLTableRowElement | HTMLOptionElement,
  classes: string,
  toggle: boolean,
) {
  element.classList.toggle(classes, toggle);
  element.classList.toggle(css.hidden, !toggle && searchCollapse);
}
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
