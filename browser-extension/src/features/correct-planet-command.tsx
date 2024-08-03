import { changeValue } from '../util';
import PrunCss from '@src/prun-ui/prun-css';
import features from '@src/feature-registry';
import prun from '@src/prun-api/prun';
import observeReadyElementsByClassName from '@src/utils/mutation-observer';
import { _$ } from '@src/utils/get-element-by-class-name';

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

function onSelectorReady(selector: HTMLDivElement) {
  const input = _$(PrunCss.PanelSelector.input, selector) as HTMLInputElement;
  const form = input.form!;
  form.addEventListener('submit', ev => {
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
  });
}

export function init() {
  observeReadyElementsByClassName(PrunCss.Tile.selector, onSelectorReady);
}

void features.add({
  id: 'correct-planet-command',
  init,
});
