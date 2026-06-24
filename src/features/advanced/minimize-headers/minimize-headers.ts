import MinimizeRow from './MinimizeRow.vue';
import { observeHtmlCollection } from '@src/utils/observe-html-collection';
import { computedTileState } from '@src/store/user-data-tiles';
import { getTileState } from './tile-state';
import { contractsStore, isFactionContract } from '@src/infrastructure/prun-api/data/contracts';

function onTileReady(tile: PrunTile) {
  const isMinimized = computedTileState(getTileState(tile), 'minimizeHeader', true);

  subscribe(observeHtmlCollection(tile.anchor, tile.anchor.children), async child => {
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
  for (const field of _$$(tile.anchor, C.FormComponent.containerPassive)) {
    if (shouldHandleField(tile, field)) {
      field.style.display = isMinimized ? 'none' : '';
    }
  }
}

function shouldHandleField(tile: PrunTile, field: HTMLElement) {
  const label = _$(field, 'label');
  const labelText = label?.textContent;
  if (labelText === 'Minimize') {
    // Field added by MinimizeRow.
    return false;
  }
  switch (tile.command) {
    case 'CONT': {
      if (labelText === L.Contract.termination()) {
        const value = _$(field, C.FormComponent.input);
        if (value?.textContent !== '--') {
          // The "Request Termination" button.
          return false;
        }
      }
      if (labelText === L.Contract.preamble()) {
        const contract = contractsStore.getByLocalId(tile.parameter);
        const value = _$(field, C.FormComponent.input);
        if (value?.textContent !== '--' && contract && !isFactionContract(contract)) {
          // Preamble for user-made contracts.
          return false;
        }
      }
      break;
    }
    case 'POPID': {
      if (labelText === L.Contribution.stores()) {
        // Drop-down box with inventory selection.
        return false;
      }
      break;
    }
  }
  return true;
}

function init() {
  tiles.observe(['CX', 'CONT', 'LM', 'SYSI', 'POPID'], onTileReady);
}

features.add(import.meta.url, init, 'Minimizes headers in CX, CONT, LM, and SYSI.');
