import { changeValue } from '../util';
import PrunCss from '@src/prun-ui/prun-css';
import features from '@src/feature-registry';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import { _$ } from '@src/utils/get-element-by-class-name';
import { materialsStore } from '@src/prun-api/data/materials';

const correctableCommands = new Set(['CXM', 'CXOB', 'CXP', 'CXPC', 'CXPO', 'MAT']);

export function onSelectorReady(selector: HTMLDivElement) {
  const input = _$(PrunCss.PanelSelector.input, selector) as HTMLInputElement;
  const form = input.form!;
  form.addEventListener('submit', ev => {
    const commandParts = input.value.split(' ');
    if (!correctableCommands.has(commandParts[0].toUpperCase())) {
      return;
    }

    const parameter = commandParts[1];
    if (parameter === parameter.toUpperCase()) {
      return;
    }

    const material = materialsStore.getByTicker(parameter);
    if (!material) {
      return;
    }

    ev.stopPropagation();
    commandParts[1] = parameter.toUpperCase();
    changeValue(input, commandParts.join(' '));
    setTimeout(() => form.requestSubmit(), 0);
  });
}

export function init() {
  observeReadyElementsByClassName(PrunCss.Tile.selector, onSelectorReady);
}

void features.add({
  id: 'correct-material-command',
  init,
});
