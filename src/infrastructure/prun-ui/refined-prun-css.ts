import { castArray } from '@src/utils/cast-array';

const rules: { [id: string]: string } = {};

export function loadRefinedPrunCss() {
  const css = document.getElementById('refined-prun-css')!;
  Object.assign(rules, JSON.parse(css.textContent!));
  css.textContent = null;
}

export function applyClassCssRule(classNames: Arrayable<string>, sourceClass: string) {
  for (const className of castArray(classNames)) {
    applyCssRule(`.${className}`, sourceClass);
  }
}

export function applyScopedClassCssRule(
  commands: Arrayable<string>,
  classNames: Arrayable<string>,
  sourceClass: string,
) {
  classNames = castArray(classNames);
  for (const command of castArray(commands)) {
    for (const className of classNames) {
      applyCssRule(`${selectCommand(command)} .${className}`, sourceClass);
    }
  }
}

export function applyScopedCssRule(
  commands: Arrayable<string>,
  selectors: Arrayable<string>,
  sourceClass: string,
) {
  selectors = castArray(selectors);
  for (const command of castArray(commands)) {
    for (const selector of selectors) {
      applyCssRule(`${selectCommand(command)} ${selector}`, sourceClass);
    }
  }
}

export function applyCssRule(selector: string, sourceClass: string) {
  if (!sourceClass) {
    throw new Error('Source class is undefined');
  }
  if (!features.current) {
    throw new Error('Cannot apply css rules outside of feature init');
  }
  const sourceSelector = '.' + sourceClass;
  const match = rules[sourceSelector];
  if (!match) {
    throw new Error(`Failed to find css selector ${sourceSelector}`);
  }
  applyRawCssRule(match.replace(sourceSelector, selector));
}

let currentSheet = {
  id: '',
  textContent: '',
};
const sheets: (typeof currentSheet)[] = [];

export function applyRawCssRule(rule: string) {
  if (currentSheet.id !== features.current) {
    queueSheetAppend();
    currentSheet = {
      id: features.current!,
      textContent: '',
    };
    sheets.push(currentSheet);
  } else {
    currentSheet.textContent += '\n\n';
  }
  currentSheet.textContent += rule;
}

function queueSheetAppend() {
  if (sheets.length > 0) {
    return;
  }
  queueMicrotask(() => {
    for (const sheet of sheets) {
      const style = document.createElement('style');
      style.id = `rp-css-${sheet.id}`;
      style.textContent = `.refined-prun ${wrapInBrackets(sheet.textContent)}`;
      document.head.appendChild(style);
    }
  });
}

function wrapInBrackets(text: string) {
  return `{\n  ${indent(text)}\n}`;
}

function indent(text: string) {
  return text.replaceAll('\n', '\n  ');
}

function selectCommand(command: string) {
  return `.${C.TileFrame.frame}[data-rp-command='${command}']`;
}
