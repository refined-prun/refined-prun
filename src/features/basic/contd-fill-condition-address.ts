import { contractDraftsStore } from '@src/infrastructure/prun-api/data/contract-drafts';
import { changeInputValue, clickElement, focusElement, mouseOverElement } from '@src/util';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { sleep } from '@src/utils/sleep';

function onTileReady(tile: PrunTile) {
  const draft = computed(() => contractDraftsStore.getByNaturalId(tile.parameter));
  let conditionIndex: number | undefined;
  subscribe($$(tile.anchor, C.Draft.conditions), conditions => {
    return subscribe($$(conditions, 'tr'), row => {
      const indexText = row.children[0]?.textContent;
      const conditionEditButton = _$$(row, C.Button.btn)[0];
      if (!indexText || !conditionEditButton) {
        return;
      }
      conditionEditButton.addEventListener('click', () => {
        const index = parseInt(indexText.replace('#', ''));
        if (isFinite(index)) {
          conditionIndex = index - 1;
        }
      });
    });
  });
  subscribe($$(tile.anchor, C.DraftConditionEditor.form), async form => {
    if (conditionIndex === undefined) {
      return;
    }
    const address = draft.value?.conditions[conditionIndex]?.address;
    const naturalId = getEntityNaturalIdFromAddress(address);
    conditionIndex = undefined;
    if (naturalId) {
      const container = await $(form, C.AddressSelector.container);
      const input = (await $(container, C.AddressSelector.input)) as HTMLInputElement;
      const suggestionsContainer = await $(container, C.AddressSelector.suggestionsContainer);
      suggestionsContainer.style.display = 'none';
      focusElement(input);
      changeInputValue(input, naturalId);
      // The first section container is the "Search results".
      const sectionContainer = await $(container, C.AddressSelector.sectionContainer);
      const suggestion = await $(sectionContainer, C.AddressSelector.suggestion);
      // Mouse over event is needed for react-autosuggest to properly use the clicked suggestion.
      mouseOverElement(sectionContainer, suggestion);
      await sleep(0);
      await clickElement(suggestion);
      suggestionsContainer.style.display = '';
    }
  });
}

function init() {
  tiles.observe('CONTD', onTileReady);
}

features.add(import.meta.url, init, 'CONTD: Fills the address field in the condition editor.');
