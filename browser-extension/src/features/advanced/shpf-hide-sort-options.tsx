import css from '@src/utils/css-utils.module.css';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { applyScopedClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

export function init() {
  applyScopedClassCssRule('SHPF', PrunCss.InventorySortControls.controls, css.hidden);
}

void features.add({
  id: 'shpf-hide-sort-options',
  advanced: true,
  init,
});
