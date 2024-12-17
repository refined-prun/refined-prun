import { changeInputValue } from '@src/util';
import { correctMaterialCommand } from './material-commands';
import { correctPlanetCommand } from './planet-commands';
import { correctShipCommand } from './ship-commands';
import { correctSystemCommand } from './system-commands';
import { correctXitWeb } from './xit-web';
import { correctXitArgs } from '@src/features/basic/correct-commands/xit-args';

const transformers = [
  correctMaterialCommand,
  correctPlanetCommand,
  correctShipCommand,
  correctSystemCommand,
  correctXitWeb,
  correctXitArgs,
];

async function onSelectorReady(selector: HTMLElement) {
  const input: HTMLInputElement = await $(selector, C.PanelSelector.input);
  const form = input.form!;
  form.addEventListener('submit', ev => {
    const parts = input.value.split(' ');
    for (const transform of transformers) {
      transform(parts);
    }

    const command = parts.join(' ');
    if (input.value === command) {
      return;
    }

    ev.stopPropagation();
    ev.preventDefault();
    changeInputValue(input, command);
    setTimeout(() => form.requestSubmit(), 0);
  });
}

function init() {
  subscribe($$(document, C.Tile.selector), onSelectorReady);
}

features.add(import.meta.url, init, 'Corrects tile commands.');
