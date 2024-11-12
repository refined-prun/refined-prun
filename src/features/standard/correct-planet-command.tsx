import { changeValue } from '@src/util';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
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
  const input: HTMLInputElement = await $(selector, C.PanelSelector.input);
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
    ev.preventDefault();
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

function init() {
  subscribe($$(document, C.Tile.selector), onSelectorReady);
}

features.add(import.meta.url, init, 'Corrects planet commands.');
