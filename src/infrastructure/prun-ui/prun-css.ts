import { registerClassName } from '@src/utils/select-dom';
import { watchUntil } from '@src/utils/watch';
import { sleep } from '@src/utils/sleep';

export const C = {} as PrunCssClasses;
export const prunCssStylesheets = reactive<Set<HTMLStyleElement>>(new Set());
const appContainerFound = ref(false);
export let mergedPrunStyles = '';
export const prunStyleUpdated = ref(false);

export async function loadPrunCss() {
  for (const style of _$$(document.head, 'style')) {
    processStylesheet(style);
  }

  subscribe($$(document.head, 'style'), processStylesheet);
  await watchUntil(() => appContainerFound.value);

  if (import.meta.env.DEV) {
    void checkPrunCssUpdate();
  }
}

function processStylesheet(style: HTMLStyleElement) {
  if (style.dataset.source !== 'prun' || prunCssStylesheets.has(style)) {
    return;
  }

  const classSet = new Set<string>();
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
    }
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

  prunCssStylesheets.add(style);
  appContainerFound.value = C.App?.container !== undefined;

  mergedPrunStyles +=
    style
      .textContent!.split('\n')
      .filter(x => !x.includes('sourceMappingURL'))
      .join('\n') + '\n';
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
