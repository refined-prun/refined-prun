import css from '@src/utils/css-utils.module.css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule(C.StoreView.name, css.hidden);
}

features.add(import.meta.url, init, 'Hides "Weight" and "Volume" labels in all inventories.');
