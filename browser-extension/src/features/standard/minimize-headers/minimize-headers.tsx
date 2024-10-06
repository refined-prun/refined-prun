import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import MinimizeRow from '@src/features/standard/minimize-headers/MinimizeRow.vue';
import { reactive, ref } from 'vue';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { $, $$, _$ } from '@src/utils/select-dom';

async function onTileReady(tile: PrunTile) {
  if (companyStore.value?.code === 'KCB') {
    return;
  }
  const header = await $(tile.frame, PrunCss.FormComponent.containerPassive);
  setHeaders(tile, true);

  const isMinimized = ref(true);

  createFragmentApp(
    MinimizeRow,
    reactive({
      isMinimized,
      onClick: () => {
        isMinimized.value = !isMinimized.value;
        setHeaders(tile, isMinimized.value);
      },
    }),
  ).before(header);
}

function setHeaders(tile: PrunTile, isMinimized: boolean) {
  for (const header of $$(tile.frame, PrunCss.FormComponent.containerPassive)) {
    const label = _$(header, PrunCss.FormComponent.label);
    if (label?.textContent === 'Minimize') {
      continue;
    }
    if (label?.textContent === 'Termination request') {
      const value = _$(header, PrunCss.FormComponent.input);
      if (value?.textContent !== '--') {
        continue;
      }
    }
    header.style.display = isMinimized ? 'none' : 'flex';
  }
}

function init() {
  tiles.observe(['CX', 'CONT', 'LM', 'SYSI'], onTileReady);
}

void features.add({
  id: 'minimize-headers',
  init,
});
