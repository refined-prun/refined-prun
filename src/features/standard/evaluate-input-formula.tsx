import fa from '@src/utils/font-awesome.module.css';
import classes from './evaluate-input-formula.module.css';
import { changeValue } from '@src/util';
import features from '@src/feature-registry';
import Mexp from 'math-expression-evaluator';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { $$ } from '@src/utils/select-dom';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';

const mexp = new Mexp();

function onKeyDown(input: HTMLInputElement, e: KeyboardEvent) {
  if (e.key !== 'Enter' && e.key !== 'Tab') {
    return;
  }

  if (!input.value) {
    return;
  }

  let expression = input.value.charAt(0) === '=' ? input.value.substring(1) : input.value;
  expression = replaceMaterialProperties(expression);
  const result = parseFloat(mexp.eval(expression).toFixed(6));
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

function init() {
  applyCssRules();
  subscribe($$(document.documentElement, 'input'), input => {
    if (input.inputMode !== 'numeric' && input.inputMode !== 'decimal') {
      return;
    }
    input.addEventListener('keydown', e => onKeyDown(input, e));
  });
}

function applyCssRules() {
  const inputSelector = `div:has(> input:is([inputmode='numeric'], [inputmode='decimal']):focus)`;
  // Remove hard-coded class when molp fixes class duplication
  const selector = `.FormComponent__input___f43wqaQ ${inputSelector}`;
  applyCssRule(selector, classes.inputContainer);
  applyCssRule(`${selector}:before`, fa.solid);
  applyCssRule(`${selector}:before`, classes.functionIcon);
  const selectorDynamic = `.${PrunCss.DynamicInput.dynamic} ${inputSelector}`;
  applyCssRule(selectorDynamic, classes.inputContainer);
  applyCssRule(`${selectorDynamic}:before`, fa.solid);
  applyCssRule(`${selectorDynamic}:before`, classes.functionIconDynamic);
}

features.add({
  id: 'evaluate-input-formula',
  description: 'Evaluates input formulas in numeric text fields on Enter.',
  init,
});
