import { createFragmentApp } from '@src/utils/vue-fragment-app';
import MinimizeRow from './MinimizeRow.vue';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { streamHtmlCollection } from '@src/utils/stream-html-collection';

function onTileReady(tile: PrunTile) {
  if (companyStore.value?.code === 'KCB') {
    return;
  }
  subscribe(streamHtmlCollection(tile.anchor, tile.anchor.children), async child => {
    const header = await $(child, C.FormComponent.containerPassive);
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
  });
}

function setHeaders(tile: PrunTile, isMinimized: boolean) {
  for (const header of $$(tile.anchor, C.FormComponent.containerPassive)) {
    const label = _$(header, C.FormComponent.label);
    if (label?.textContent === 'Minimize') {
      continue;
    }
    if (label?.textContent === 'Termination request') {
      const value = _$(header, C.FormComponent.input);
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

features.add({
  id: 'minimize-headers',
  description: 'Adds a button to minimize headers in CX, CONT, LM, and SYSI.',
  advanced: true,
  init,
});
