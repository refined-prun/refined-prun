import { castArray } from '@src/utils/cast-array';

let styleElement: HTMLStyleElement | undefined = undefined;

const rules: { [id: string]: string } = {};

export async function loadRefinedPrunCss() {
  const css = document.createElement('link');
  css.href = chrome.runtime.getURL(`refined-prun.css`) + '?' + Date.now();
  css.id = 'refined-prun-css';
  css.rel = 'stylesheet';
  await new Promise(resolve => {
    css.onload = resolve;
    document.documentElement.appendChild(css);
  });
  readRules(css.sheet!);
}

function readRules(sheet: CSSStyleSheet) {
  for (let i = 0; i < sheet.cssRules.length; i++) {
    const rule = sheet.cssRules.item(i) as CSSStyleRule;
    if (!rule) {
      continue;
    }
    rules[rule.selectorText] = rule.cssText;
  }
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

let at: string | undefined = undefined;

export function startCssAtScope(scope: string) {
  at = scope;
}

export function endCssAtScope() {
  at = undefined;
}

export function applyRawCssRule(rule: string) {
  const styleId = `rp-${features.current}`;
  if (!styleElement || styleElement.id !== styleId) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = '';
    document.head.appendChild(styleElement);
  } else {
    styleElement.textContent += '\n\n';
  }
  let fullRule = `html[refined-prun] ${rule}`;
  if (at) {
    fullRule = `${at} { ${fullRule} }`;
  }
  styleElement.textContent += fullRule;
}

function selectCommand(command: string) {
  return `.${C.TileFrame.frame}[data-rp-command='${command}']`;
}
