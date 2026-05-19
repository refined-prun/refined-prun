import MinimizeRow from './MinimizeRow.vue';
import { streamHtmlCollection } from '@src/utils/stream-html-collection';
import { computedTileState } from '@src/store/user-data-tiles';
import { getTileState } from './tile-state';
import { PrunI18N } from '@src/infrastructure/prun-ui/i18n';

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
    if (matchesLocalization(label, 'Contract.termination', 'Termination request')) {
      const value = _$(header, C.FormComponent.input);
      if (value?.textContent !== '--') {
        continue;
      }
    }
    if (matchesLocalization(label, 'Contribution.stores', 'Inventory')) {
      continue;
    }
    header.style.display = isMinimized ? 'none' : 'flex';
  }
}

function matchesLocalization(element: Element | undefined, key: string, defaultValue: string) {
  const text = PrunI18N[key]?.[0]?.value ?? defaultValue;
  return element?.textContent === text;
}

function init() {
  tiles.observe(['CX', 'CONT', 'LM', 'SYSI', 'POPID'], onTileReady);
}

features.add(import.meta.url, init, 'Minimizes headers in CX, CONT, LM, and SYSI.');
