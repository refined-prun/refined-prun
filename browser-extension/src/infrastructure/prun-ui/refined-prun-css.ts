import system from '@src/system';
import { castArray } from '@src/utils/cast-array';
import features from '@src/feature-registry';

let styleElement: HTMLStyleElement | undefined = undefined;

type FeatureRules = { [id: string]: { [key: string]: string } };

const featureRules: FeatureRules = {};

export async function loadRefinedPrunCss() {
  const css = document.createElement('link');
  css.href = system.runtime.getURL(`refined-prun.css`);
  css.id = 'refined-prun-css';
  css.rel = 'stylesheet';
  await new Promise(resolve => {
    css.onload = resolve;
    document.documentElement.appendChild(css);
  });
  await buildFeatureRules(css.sheet!);
}

async function buildFeatureRules(sheet: CSSStyleSheet) {
  for (let i = 0; i < sheet.cssRules.length; i++) {
    const rule = sheet.cssRules.item(i) as CSSStyleRule;
    const selector = rule?.selectorText;
    if (!selector?.includes('__')) {
      continue;
    }
    const matches = selector.match(/\.([a-z-]+)__([a-z-:]+)$/);
    if (!matches) {
      continue;
    }
    const id = matches[1];
    const key = matches[2];
    let feature = featureRules[id];
    if (!feature) {
      feature = {};
      featureRules[id] = feature;
    }
    feature[key] = rule.cssText.replace(selector, '/* selector */');
  }
}

export function applyClassCssRule(classNames: Arrayable<string>, key: string) {
  for (const className of castArray(classNames)) {
    applyCssRule(`.${className}`, key);
  }
}

export function applyScopedClassCssRule(
  buffers: Arrayable<string>,
  classNames: Arrayable<string>,
  key: string,
) {
  classNames = castArray(classNames);
  for (const buffer of castArray(buffers)) {
    for (const className of classNames) {
      applyCssRule(`${selectBuffer(buffer)} .${className}`, key);
    }
  }
}

export function applyScopedCssRule(
  buffers: Arrayable<string>,
  selectors: Arrayable<string>,
  key: string,
) {
  selectors = castArray(selectors);
  for (const buffer of castArray(buffers)) {
    for (const selector of selectors) {
      applyCssRule(`${selectBuffer(buffer)} ${selector}`, key);
    }
  }
}

export function applyCssRule(selector: string, key: string) {
  if (!features.current) {
    throw new Error('Cannot apply css rules outside of feature init');
  }
  const match = featureRules[features.current]?.[key];
  if (!match) {
    throw new Error(`Failed to match rule ${features.current}__${key}`);
  }
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'rp-css-rules';
    styleElement.textContent = '';
    document.head.appendChild(styleElement);
  } else {
    styleElement.textContent += '\n\n';
  }
  const attribute = `rp-${features.current}`;
  const prefix = `html[${attribute}] `;
  document.documentElement.setAttribute(attribute, '');
  styleElement.textContent += match.replace('/* selector */', prefix + selector);
}

function selectBuffer(buffer: string) {
  return `div[data-rp-command='${buffer}']`;
}
