import { changeValue } from '@src/util';
import features from '@src/feature-registry';
import tiles from '@src/infrastructure/prun-ui/tiles';
import Mexp from 'math-expression-evaluator';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { $$ } from '@src/utils/select-dom';

const mexp = new Mexp();

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'input'), input => {
    input.addEventListener('keyup', e => onKeyUp(input, e));
  });
}

function onKeyUp(input: HTMLInputElement, e: KeyboardEvent) {
  if (e.key !== 'Enter') {
    return;
  }

  if (input.value.charAt(0) !== '=') {
    return;
  }

  let expression = input.value.substring(1);
  expression = replaceMaterialProperties(expression);
  const result = mexp.eval(expression);
  changeValue(input, result.toString());
}

function replaceMaterialProperties(expression: string) {
  const matches = expression.match(/\b([a-zA-Z0-9]{1,3})\.(?:w|t|v|m|m3|max)\b/gi) ?? [];
  for (const match of matches) {
    const parts = match.split('.');
    const material = materialsStore.getByTicker(parts[0]);
    if (material === undefined) {
      continue;
    }
    let property: number | undefined;
    switch (parts[1]) {
      case 'w':
      case 't':
        property = material.weight;
        break;
      case 'v':
      case 'm':
      case 'm3':
        property = material.volume;
        break;
      case 'max':
        property = Math.max(material.weight, material.volume);
        break;
    }
    if (property) {
      expression = expression.replace(match, property.toFixed(3));
    }
  }
  return expression;
}

export function init() {
  tiles.observe(['CXPO', 'FXPO', 'LMP', 'CONTD', 'MTRA', 'MOTS'], onTileReady);
}

void features.add({
  id: 'evaluate-input-formula',
  init,
});
