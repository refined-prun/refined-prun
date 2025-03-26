import fa from '@src/utils/font-awesome.module.css';
import $style from './input-math.module.css';
import { changeInputValue } from '@src/util';
import Mexp from 'math-expression-evaluator';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

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
  changeInputValue(input, result.toString());
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
  subscribe($$(document, 'input'), input => {
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
  applyCssRule(selector, $style.inputContainer);
  applyCssRule(`${selector}:before`, fa.solid);
  applyCssRule(`${selector}:before`, $style.functionIcon);
  const selectorDynamic = `.${C.DynamicInput.dynamic} ${inputSelector}`;
  applyCssRule(selectorDynamic, $style.inputContainer);
  applyCssRule(`${selectorDynamic}:before`, fa.solid);
  applyCssRule(`${selectorDynamic}:before`, $style.functionIconDynamic);
}

features.add(
  import.meta.url,
  init,
  'Evaluates math expressions in numeric text fields on Enter or Tab.',
);
