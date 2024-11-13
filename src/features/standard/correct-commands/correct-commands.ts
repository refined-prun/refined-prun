import { changeValue } from '@src/util';
import { correctMaterialCommand } from '@src/features/standard/correct-commands/material-commands';
import { correctPlanetCommand } from '@src/features/standard/correct-commands/planet-commands';
import { correctShipCommand } from '@src/features/standard/correct-commands/ship-commands';
import { correctSystemCommand } from '@src/features/standard/correct-commands/system-commands';
import { correctXitWeb } from '@src/features/standard/correct-commands/xit-web';

const transformers = [
  correctMaterialCommand,
  correctPlanetCommand,
  correctShipCommand,
  correctSystemCommand,
  correctXitWeb,
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
    changeValue(input, command);
    setTimeout(() => form.requestSubmit(), 0);
  });
}

function init() {
  subscribe($$(document, C.Tile.selector), onSelectorReady);
}

features.add(import.meta.url, init, 'Corrects tile commands.');
