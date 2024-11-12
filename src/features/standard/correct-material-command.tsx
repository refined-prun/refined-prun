import { changeValue } from '@src/util';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

const correctableCommands = new Set(['CXM', 'CXOB', 'CXP', 'CXPC', 'CXPO', 'MAT']);

async function onSelectorReady(selector: HTMLElement) {
  const input: HTMLInputElement = await $(selector, PrunCss.PanelSelector.input);
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

function init() {
  subscribe($$(document, PrunCss.Tile.selector), onSelectorReady);
}

features.add({
  id: 'correct-material-command',
  description: 'Corrects material commands.',
  init,
});
