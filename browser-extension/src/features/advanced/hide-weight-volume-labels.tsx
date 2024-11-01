import css from '@src/utils/css-utils.module.css';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

export function init() {
  applyClassCssRule(PrunCss.StoreView.name, css.hidden);
}

void features.add({
  id: 'hide-weight-volume-labels',
  description: 'Hides "Weight" and "Volume" labels in all inventories.',
  advanced: true,
  init,
});
