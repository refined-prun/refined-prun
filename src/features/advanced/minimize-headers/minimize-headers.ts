import MinimizeRow from './MinimizeRow.vue';
import { streamHtmlCollection } from '@src/utils/stream-html-collection';
import { computedTileState } from '@src/store/user-data-tiles';
import { getTileState } from './tile-state';
import { L } from '@src/infrastructure/prun-ui/i18n';

function onTileReady(tile: PrunTile) {
  const isMinimized = computedTileState(getTileState(tile), 'minimizeHeader', true);

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
  for (const header of _$$(tile.anchor, C.FormComponent.containerPassive)) {
    const label = _$(header, 'label');
    if (label?.textContent === 'Minimize') {
      continue;
    }
    if (label === L.Contract.termination.format()) {
      const value = _$(header, C.FormComponent.input);
      if (value?.textContent !== '--') {
        continue;
      }
    }
    if (label === L.Contribution.stores.format()) {
      continue;
    }
    header.style.display = isMinimized ? 'none' : 'flex';
  }
}

function init() {
  tiles.observe(['CX', 'CONT', 'LM', 'SYSI', 'POPID'], onTileReady);
}

features.add(import.meta.url, init, 'Minimizes headers in CX, CONT, LM, and SYSI.');
