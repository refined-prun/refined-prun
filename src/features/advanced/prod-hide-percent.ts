import css from '@src/utils/css-utils.module.css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule(C.OrderStatus.inProgress, css.hidden);
}

features.add(
  import.meta.url,
  init,
  'Hides percent value in PROD orders list',
);
