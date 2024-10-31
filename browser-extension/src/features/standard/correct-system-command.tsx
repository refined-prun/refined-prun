import { changeValue } from '@src/util';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { $, $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';
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
    const star = starsStore.find(starName);
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

export function init() {
  subscribe($$(document, PrunCss.Tile.selector), onSelectorReady);
}

void features.add({
  id: 'correct-system-command',
  init,
});
