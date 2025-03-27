<script setup lang="ts">
import TextInput from '@src/components/forms/TextInput.vue';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import RadioItem from '@src/components/forms/RadioItem.vue';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import css from '@src/utils/css-utils.module.css';
import onNodeDisconnected from '@src/utils/on-node-disconnected';
import { getMaterialName } from '@src/infrastructure/prun-ui/i18n';

const $style = useCssModule();

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
      !option.classList.contains($style.matchingCategory) && collapseOthersWithoutText,
    );
  }
  for (const row of rowElements.values()) {
    if (row.isConnected) {
      row.classList.toggle(
        css.hidden,
        !row.classList.contains($style.matchingRow) && collapseOthersWithoutText,
      );
    }
  }
  collapseSearch = collapseOthers.value;
});

const resetElement = (value: HTMLElement) => {
  if (value.isConnected) {
    value.classList.remove($style.matchingCategory, $style.matchingRow);
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
        getMaterialName(material)?.toUpperCase().includes(searchTerm)
      ) {
        const optionElement = optionElements.get(material.category);
        if (optionElement) {
          optionElement.classList.add($style.matchingCategory);
          optionElement.classList.remove(css.hidden);
        }
        const rowElement = rowElements.get(material.ticker);
        if (rowElement && rowElement.isConnected) {
          rowElement.classList.add($style.matchingRow);
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
    <RadioItem v-model="collapseOthers">Results Only</RadioItem>
  </div>
</template>

<style module>
.textInputElement {
  display: flex;
  align-items: center;
}

.matchingRow::after {
  background-color: rgba(92, 184, 92, 0.175) !important;
}

.matchingCategory {
  background-color: rgba(92, 184, 92, 0.175);
}
</style>
