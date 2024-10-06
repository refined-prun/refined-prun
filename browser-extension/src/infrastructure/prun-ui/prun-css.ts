import { CssClasses } from '@src/infrastructure/prun-ui/prun-css-types';
import oneMutation from 'one-mutation';
import { registerClassName } from '@src/utils/select-dom';

// @ts-expect-error This object will be loaded via function below
const PrunCss: CssClasses = {};
export default PrunCss;

export async function parsePrunCss() {
  const head = document.head;
  const styles = head.getElementsByTagName('style');
  if (styles.length === 0) {
    await oneMutation(head, {
      childList: true,
      filter: () => styles.length > 0,
    });
  }
  const classSet = new Set<string>();
  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
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
        classSet.add(match.replace('.', ''));
      }
    }
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
  Object.assign(PrunCss, result);
}
