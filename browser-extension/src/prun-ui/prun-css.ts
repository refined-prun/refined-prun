import { $$ } from 'select-dom';
import { CssClasses } from '@src/prun-ui/prun-css-types';

// @ts-expect-error This object will be loaded via function below
const PrunCss: CssClasses = {};

export function loadPrunCss() {
  const classSet = new Set<string>();
  const styles = $$('style', document.head);
  for (const style of styles) {
    const text = style.textContent;
    if (!text) {
      continue;
    }
    for (const line of text.split('\n')) {
      if (!line.includes('___')) {
        continue;
      }

      const matches = line.match(/[\w-]+__[\w-]+___[\w-]+/g);
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

export default PrunCss;
