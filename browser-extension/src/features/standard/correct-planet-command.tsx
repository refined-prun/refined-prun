import { changeValue } from '@src/util';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { $, $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { getStarNaturalId, starsStore } from '@src/infrastructure/prun-api/data/stars';

const correctableCommands = new Set([
  'ADM',
  'BBC',
  'BRA',
  'BS',
  'BSC',
  'COGC',
  'COGCPEX',
  'COGCU',
  'FLTP',
  'GOV',
  'INV',
  'LM',
  'LMP',
  'LR',
  'PLI',
  'POPI',
  'POPR',
  'PPS',
  'SHY',
  'WAR',
]);

async function onSelectorReady(selector: HTMLElement) {
  const input: HTMLInputElement = await $(selector, PrunCss.PanelSelector.input);
  const form = input.form!;
  form.addEventListener('submit', ev => {
    const fullCommand = input.value.split(' ');
    if (!correctableCommands.has(fullCommand[0].toUpperCase())) {
      return;
    }

    const commandParts = fullCommand.slice(1);
    const naturalId = correctByPlanetName(commandParts) ?? correctByStarName(commandParts);

    if (!naturalId) {
      return;
    }

    ev.stopPropagation();
    const newCommandParts = [fullCommand[0], naturalId];
    changeValue(input, newCommandParts.join(' '));
    setTimeout(() => form.requestSubmit(), 0);
  });
}

function correctByPlanetName(commandParts: string[]) {
  const planetName = commandParts.join(' ');
  const planet = planetsStore.find(planetName);
  return planet && planetName !== planet.naturalId ? planet.naturalId : undefined;
}

function correctByStarName(commandParts: string[]) {
  if (commandParts.length < 2) {
    return undefined;
  }
  const systemName = commandParts.slice(0, -1).join(' ');
  const star = starsStore.getByName(systemName);
  if (!star) {
    return undefined;
  }
  return getStarNaturalId(star) + commandParts[commandParts.length - 1];
}

export function init() {
  subscribe($$(document, PrunCss.Tile.selector), onSelectorReady);
}

void features.add({
  id: 'correct-planet-command',
  description: 'Corrects planet commands.',
  init,
});
