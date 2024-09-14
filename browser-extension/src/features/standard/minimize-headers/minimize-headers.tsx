import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import descendantPresent from '@src/utils/descendant-present';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { _$, _$$ } from '@src/utils/get-element-by-class-name';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import MinimizeRow from '@src/features/standard/minimize-headers/MinimizeRow.vue';
import { reactive, ref } from 'vue';
import { companyStore } from '@src/infrastructure/prun-api/data/company';

async function onTileReady(tile: PrunTile) {
  if (companyStore.code === 'KCB') {
    return;
  }
  const header = await descendantPresent(tile.frame, PrunCss.FormComponent.containerPassive);
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
  const headers = _$$(PrunCss.FormComponent.containerPassive, tile.frame);
  for (const header of headers) {
    const label = _$(PrunCss.FormComponent.label, header);
    if (label?.textContent === 'Minimize') {
      continue;
    }
    if (label?.textContent === 'Termination request') {
      const value = _$(PrunCss.FormComponent.input, header);
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
