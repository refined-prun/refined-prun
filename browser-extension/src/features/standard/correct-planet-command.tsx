import { changeValue } from '@src/util';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { $, $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';

const correctableCommands = new Set([
  'ADM',
  'BSC',
  'COGC',
  'COGCPEX',
  'COGCU',
  'FLTP',
  'LR',
  'LMP',
  'LM',
  'PLI',
  'POPI',
  'POPR',
  'PPS',
  'SHY',
  'WAR',
  'BS',
  'BRA',
  'GOV',
]);

async function onSelectorReady(selector: HTMLElement) {
  const input: HTMLInputElement = await $(selector, PrunCss.PanelSelector.input);
  const form = input.form!;
  form.addEventListener('submit', ev => {
    const commandParts = input.value.split(' ');
    if (!correctableCommands.has(commandParts[0].toUpperCase())) {
      return;
    }

    const parameter = commandParts.slice(1).join(' ');
    const planet = planetsStore.find(parameter);
    if (!planet || parameter === planet.naturalId) {
      return;
    }

    ev.stopPropagation();
    const newCommandParts = [commandParts[0], planet.naturalId];
    changeValue(input, newCommandParts.join(' '));
    setTimeout(() => form.requestSubmit(), 0);
  });
}

export function init() {
  subscribe($$(document, PrunCss.Tile.selector), onSelectorReady);
}

void features.add({
  id: 'correct-planet-command',
  init,
});
