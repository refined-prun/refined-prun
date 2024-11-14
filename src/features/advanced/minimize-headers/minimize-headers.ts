import { createFragmentApp } from '@src/utils/vue-fragment-app';
import MinimizeRow from './MinimizeRow.vue';
import { streamHtmlCollection } from '@src/utils/stream-html-collection';
import { computedTileState } from '@src/store/user-data-tiles';
import { getTileState } from '@src/features/basic/inv-custom-sorting/tile-state';

function onTileReady(tile: PrunTile) {
  const isMinimized = computedTileState(getTileState(tile), 'minimizeHeader', true) as Ref<boolean>;

  subscribe(streamHtmlCollection(tile.anchor, tile.anchor.children), async child => {
    const header = await $(child, C.FormComponent.containerPassive);
    setHeaders(tile, isMinimized.value);

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

features.add(import.meta.url, init, 'Minimizes headers in CX, CONT, LM, and SYSI.');
