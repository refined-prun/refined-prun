import { selectAndChangeInputValue, selectMaterialInMaterialSelector } from '@src/util';
import PrunButton from '@src/components/PrunButton.vue';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { getMaterialByName } from '@src/infrastructure/prun-ui/i18n';
import css from '@src/utils/css-utils.module.css';
import $style from './contd-fill-all-button.module.css';

function onTileReady(tile: PrunTile) {
  let firstGroup: Element | undefined;

  subscribe($$(tile.anchor, C.TemplateSelection.group), group => {
    if (firstGroup?.isConnected) {
      return;
    }
    firstGroup = group;

    const amountInput = _$$(group, 'input').find(x => x.inputMode === 'numeric');
    if (amountInput) {
      addAllButton(amountInput, () => fillAll(tile.anchor, amountInput));
    }

    const priceInput = _$$(group, 'input').find(x => x.inputMode === 'decimal');
    if (priceInput) {
      addAllButton(priceInput, () => fillAll(tile.anchor, priceInput));
    }

    const materialInput = _$(group, C.MaterialSelector.input);
    if (materialInput) {
      addCommodityAllButton(tile.anchor, group, materialInput);
    }
  });
}

function addCommodityAllButton(anchor: Element, sourceGroup: Element, sourceInput: Element) {
  let filling = false;
  const onClick = async () => {
    if (filling) {
      return;
    }
    filling = true;
    try {
      await fillAllCommodity(anchor, sourceGroup);
    } finally {
      filling = false;
    }
  };
  addAllButton(sourceInput, onClick);
}

function addAllButton(sourceInput: Element, onClick: () => void) {
  createFragmentApp(() => (
    <PrunButton dark inline class={$style.allButton} onClick={onClick}>
      all
    </PrunButton>
  )).before(sourceInput);
}

function fillAll(anchor: Element, sourceInput: HTMLInputElement) {
  const value = sourceInput.value;
  for (const group of _$$(anchor, C.TemplateSelection.group)) {
    const target = _$$(group, 'input').find(x => x.inputMode === sourceInput.inputMode);
    if (target && target !== sourceInput) {
      selectAndChangeInputValue(target, value);
    }
  }
}

async function fillAllCommodity(anchor: Element, sourceGroup: Element) {
  const sourceInput = _$(sourceGroup, C.MaterialSelector.input) as HTMLInputElement | undefined;
  const value = sourceInput?.value.trim();
  const material = getMaterialByName(value) ?? materialsStore.getByTicker(value);
  if (material === undefined) {
    return;
  }
  const ticker = material.ticker;

  for (const group of _$$(anchor, C.TemplateSelection.group)) {
    if (group === sourceGroup) {
      continue;
    }
    const container = _$(group, C.MaterialSelector.container);
    if (!container) {
      continue;
    }
    await selectMaterialInMaterialSelector(container, ticker);
  }
}

function init() {
  const group = `.${C.TemplateSelection.group}`;
  // Hides the buttons when there is only one group.
  applyCssRule('CONTD', `${group}:not(:has(~ ${group})) .${$style.allButton}`, css.hidden);
  tiles.observe('CONTD', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'CONTD: Adds "all" buttons next to the first commodity fields to copy values to every other commodity.',
);
