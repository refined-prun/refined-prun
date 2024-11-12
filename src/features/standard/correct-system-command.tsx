import { changeValue } from '@src/util';
import { getStarNaturalId, starsStore } from '@src/infrastructure/prun-api/data/stars';

const correctableCommands = new Set(['FLTS', 'INF', 'MS', 'SYSI']);

async function onSelectorReady(selector: HTMLElement) {
  const input: HTMLInputElement = await $(selector, PrunCss.PanelSelector.input);
  const form = input.form!;
  form.addEventListener('submit', ev => {
    const fullCommand = input.value.split(' ');
    if (!correctableCommands.has(fullCommand[0].toUpperCase())) {
      return;
    }

    const commandParts = fullCommand.slice(1);
    const starName = commandParts.join(' ');
    const star = starsStore.getByName(starName);
    if (!star) {
      return;
    }

    const naturalId = getStarNaturalId(star);
    if (starName === naturalId) {
      return;
    }

    ev.stopPropagation();
    const newCommandParts = [fullCommand[0], naturalId];
    changeValue(input, newCommandParts.join(' '));
    setTimeout(() => form.requestSubmit(), 0);
  });
}

function init() {
  subscribe($$(document, PrunCss.Tile.selector), onSelectorReady);
}

features.add({
  id: 'correct-system-command',
  description: 'Corrects system commands.',
  init,
});
