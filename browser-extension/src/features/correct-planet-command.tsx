import { changeValue } from '../util';
import planets from '@src/prun-api/planets';
import observe from '@src/utils/selector-observer';
import PrunCss from '@src/prun-ui/prun-css';
import features from '@src/feature-registry';
import { $ } from 'select-dom';
import { dot } from '@src/utils/dot';

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

export function onSelectorCreated(selector: HTMLDivElement) {
  const form = selector.children[0] as HTMLFormElement;
  const input = $(dot(PrunCss.PanelSelector.input), form) as HTMLInputElement;
  form.onsubmit = ev => {
    const commandParts = input.value.split(' ');
    if (!correctableCommands.has(commandParts[0].toUpperCase())) {
      return;
    }

    const planet = planets.getByName(commandParts[1]);
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
  observe(dot(PrunCss.Tile.selector), onSelectorCreated);
}

void features.add({
  id: 'correct-planet-command',
  init,
});
