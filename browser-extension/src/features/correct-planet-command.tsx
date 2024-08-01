import { changeValue } from '../util';
import PrunCss from '@src/prun-ui/prun-css';
import features from '@src/feature-registry';
import { $ } from 'select-dom';
import { dot } from '@src/utils/dot';
import prun from '@src/prun-api/prun';
import observeReadyElementsByClassName from '@src/utils/mutation-observer';

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

export function onSelectorReady(selector: HTMLDivElement) {
  const form = selector.children[0] as HTMLFormElement;
  const input = $(dot(PrunCss.PanelSelector.input), form) as HTMLInputElement;
  form.onsubmit = ev => {
    const commandParts = input.value.split(' ');
    if (!correctableCommands.has(commandParts[0].toUpperCase())) {
      return;
    }

    const planet = prun.planets.getByName(commandParts[1]);
    if (!planet) {
      return;
    }

    ev.stopPropagation();
    commandParts[1] = planet.naturalId;
    changeValue(input, commandParts.join(' '));
    setTimeout(() => form.requestSubmit(), 0);
  };
}

export function init() {
  observeReadyElementsByClassName(PrunCss.Tile.selector, onSelectorReady);
}

void features.add({
  id: 'correct-planet-command',
  init,
});
