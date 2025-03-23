import { contractDraftsStore } from '@src/infrastructure/prun-api/data/contract-drafts';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';

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
    const name = getEntityNameFromAddress(address);
    conditionIndex = undefined;
    if (name) {
      const input = (await $(form, C.AddressSelector.input)) as HTMLInputElement;
      input.placeholder = name;
    }
  });
}

function init() {
  tiles.observe('CONTD', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'CONTD: Sets the current address as the placeholder for the address field of the condition editor.',
);
