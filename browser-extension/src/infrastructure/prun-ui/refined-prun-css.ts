import system from '@src/system';
import { castArray } from '@src/utils/cast-array';
import features from '@src/feature-registry';

let styleElement: HTMLStyleElement | undefined = undefined;

const rules: { [id: string]: string } = {};

export async function loadRefinedPrunCss() {
  const css = document.createElement('link');
  css.href = system.runtime.getURL(`refined-prun.css`);
  css.id = 'refined-prun-css';
  css.rel = 'stylesheet';
  await new Promise(resolve => {
    css.onload = resolve;
    document.documentElement.appendChild(css);
  });
  await readRules(css.sheet!);
}

async function readRules(sheet: CSSStyleSheet) {
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
  buffers: Arrayable<string>,
  classNames: Arrayable<string>,
  sourceClass: string,
) {
  classNames = castArray(classNames);
  for (const buffer of castArray(buffers)) {
    for (const className of classNames) {
      applyCssRule(`${selectBuffer(buffer)} .${className}`, sourceClass);
    }
  }
}

export function applyScopedCssRule(
  buffers: Arrayable<string>,
  selectors: Arrayable<string>,
  sourceClass: string,
) {
  selectors = castArray(selectors);
  for (const buffer of castArray(buffers)) {
    for (const selector of selectors) {
      applyCssRule(`${selectBuffer(buffer)} ${selector}`, sourceClass);
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
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'rp-css-overrides';
    styleElement.textContent = '';
    document.head.appendChild(styleElement);
  } else {
    styleElement.textContent += '\n\n';
  }
  const attribute = `rp-${features.current}`;
  const prefix = `html[${attribute}]`;
  document.documentElement.setAttribute(attribute, '');
  styleElement.textContent += match.replace(sourceSelector, `${prefix} ${selector}`);
}

function selectBuffer(buffer: string) {
  return `div[data-rp-command='${buffer}']`;
}
