import { loadLocalJson } from '@src/util';

// @ts-expect-error This object will be loaded via loadCss()
const PrUnCss: PrUnUI.CssClasses = {};

export async function loadPrUnCss() {
  const json = await loadLocalJson('prun-css-classes.json');
  Object.assign(PrUnCss, json);
}

export default PrUnCss;
