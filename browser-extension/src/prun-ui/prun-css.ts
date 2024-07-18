import { loadLocalJson } from '@src/util';

// @ts-expect-error This object will be loaded via loadCss()
const PrunCss: PrunUI.CssClasses = {};

export async function loadPrunCss() {
  const json = await loadLocalJson('prun-css-classes.json');
  Object.assign(PrunCss, json);
}

export default PrunCss;
