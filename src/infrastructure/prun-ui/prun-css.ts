import { registerClassName } from '@src/utils/select-dom';
import { isEmpty, isPresent } from 'ts-extras';
import { sleep } from '@src/utils/sleep';

export const C = {} as PrunCssClasses;
export let mergedPrunStyles = '';
export const prunStyleUpdated = ref(false);

export function loadPrunCss() {
  const styles = getPrunCssStylesheets();
  if (isEmpty(styles)) {
    throw new Error('No styles found');
  }
  let appContainerFound = false;
  const classSet = new Set<string>();
  for (const style of styles) {
    mergedPrunStyles +=
      style
        .textContent!.split('\n')
        .filter(x => !x.includes('sourceMappingURL'))
        .join('\n') + '\n';
    const cssRules = style.sheet!.cssRules;
    for (let i = 0; i < cssRules.length; i++) {
      const rule = cssRules.item(i) as CSSStyleRule;
      const selector = rule?.selectorText;
      if (!selector?.includes('___')) {
        continue;
      }
      const matches = selector.match(/[\w-]+__[\w-]+___[\w-]+/g);
      for (const match of matches ?? []) {
        const className = match.replace('.', '');
        classSet.add(className);
        if (className.startsWith('App__container')) {
          appContainerFound = true;
        }
      }
    }
  }

  if (!appContainerFound) {
    throw new Error('No App.container class found');
  }

  const classes = Array.from(classSet);
  classes.sort();
  for (const cssClass of classes) {
    const camelize = (s: string) => s.replace(/-./g, x => x[1].toUpperCase());
    const parts = cssClass.replace('__', '.').replace('___', '.').split('.');
    const parent = camelize(parts[0]);
    if (parent === '') {
      continue;
    }
    const child = camelize(parts[1]);
    let parentObject = C[parent];
    if (parentObject === undefined) {
      parentObject = {};
      C[parent] = parentObject;
    }
    if (parentObject[child] !== undefined) {
      continue;
    }
    parentObject[child] = cssClass;
    registerClassName(cssClass);
  }

  if (import.meta.env.DEV) {
    void checkPrunCssUpdate();
  }
}

export function getPrunCssStylesheets() {
  const all = _$$(document.head, 'style');
  const valid: HTMLStyleElement[] = [];
  for (const style of all) {
    const sheet = style.sheet;
    if (!sheet) {
      continue;
    }
    try {
      if (isPresent(sheet.cssRules)) {
        valid.push(style);
      }
    } catch {
      // SecurityError: CSSStyleSheet.cssRules getter: Not allowed to access cross-origin stylesheet
      // This exception can be thrown if we try to inspect stylesheets injected by other extensions.
    }
  }
  return valid;
}

async function checkPrunCssUpdate() {
  let lastStylesheet = '';
  while (!lastStylesheet) {
    try {
      const response = await fetch('https://refined-prun.github.io/prun-css/prun.css');
      lastStylesheet = await response.text();
    } catch {
      // Do nothing.
    }
    if (!lastStylesheet) {
      await sleep(1000);
    }
  }
  prunStyleUpdated.value = lastStylesheet !== mergedPrunStyles;
}
