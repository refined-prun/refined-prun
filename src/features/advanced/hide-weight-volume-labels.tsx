import css from '@src/utils/css-utils.module.css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule(PrunCss.StoreView.name, css.hidden);
}

features.add({
  id: 'hide-weight-volume-labels',
  description: 'Hides "Weight" and "Volume" labels in all inventories.',
  advanced: true,
  init,
});
