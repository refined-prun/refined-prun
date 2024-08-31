import { $$ } from 'select-dom';
import { CssClasses } from '@src/infrastructure/prun-ui/prun-css-types';

// @ts-expect-error This object will be loaded via function below
const PrunCss: CssClasses = {};
export default PrunCss;

export function parsePrunCss() {
  const classSet = new Set<string>();
  const styles = $$('style', document.head);
  for (const style of styles) {
    const sheet = style.sheet;
    if (!sheet) {
      continue;
    }
    for (let i = 0; i < sheet.cssRules.length; i++) {
      const rule = sheet.cssRules.item(i) as CSSStyleRule;
      const selector = rule?.selectorText;
      if (!selector?.includes('___')) {
        continue;
      }
      const matches = selector.match(/[\w-]+__[\w-]+___[\w-]+/g);
      for (const match of matches ?? []) {
        classSet.add(match);
      }
    }
  }

  const classes = Array.from(classSet);
  classes.sort();
  const result = {};
  for (const cssClass of classes) {
    const camelize = (s: string) => s.replace(/-./g, x => x[1].toUpperCase());
    const parts = cssClass.replace('.', '').replace('___', '_').replace('__', '_').split('_');
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
    parentObject[child] = cssClass.replace('.', '');
  }
  Object.assign(PrunCss, result);
}