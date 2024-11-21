import { CssClasses } from '@src/infrastructure/prun-ui/prun-css-types';
import oneMutation from 'one-mutation';
import { registerClassName } from '@src/utils/select-dom';
import { isEmpty } from 'ts-extras';

// @ts-expect-error This object will be loaded via function below
export const C: CssClasses = {};

export async function loadPrunCss() {
  if (!readStyles()) {
    await oneMutation(document.head, {
      childList: true,
      filter: readStyles,
    });
  }
}

function readStyles() {
  const styles = getPrunCssStylesheets();
  if (isEmpty(styles)) {
    return false;
  }
  const classSet = new Set<string>();
  for (const style of styles) {
    const cssRules = style.sheet!.cssRules;
    for (let i = 0; i < cssRules.length; i++) {
      const rule = cssRules.item(i) as CSSStyleRule;
      const selector = rule?.selectorText;
      if (!selector?.includes('___')) {
        continue;
      }
      const matches = selector.match(/[\w-]+__[\w-]+___[\w-]+/g);
      for (const match of matches ?? []) {
        classSet.add(match.replace('.', ''));
      }
    }
  }

  if (!classSet.has('App__container___QWpTbzo')) {
    return false;
  }

  const classes = Array.from(classSet);
  classes.sort();
  const result = {};
  for (const cssClass of classes) {
    const camelize = (s: string) => s.replace(/-./g, x => x[1].toUpperCase());
    const parts = cssClass.replace('__', '.').replace('___', '.').split('.');
    const parent = camelize(parts[0]);
    if (parent === '') {
      continue;
    }
    const child = camelize(parts[1]);
    let parentObject = result[parent];
    if (parentObject === undefined) {
      parentObject = {};
      result[parent] = parentObject;
    }
    if (parentObject[child] !== undefined) {
      continue;
    }
    parentObject[child] = cssClass;
    registerClassName(cssClass);
  }

  Object.assign(C, result);
  return true;
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
      if (sheet.cssRules) {
        valid.push(style);
      }
    } catch {
      // SecurityError: CSSStyleSheet.cssRules getter: Not allowed to access cross-origin stylesheet
      // This exception can be thrown if we try to inspect stylesheets injected by other extensions.
    }
  }
  return valid;
}
