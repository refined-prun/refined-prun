import css from '@src/utils/css-utils.module.css';
import { applyScopedClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyScopedClassCssRule('PROD', C.OrderStatus.inProgress, css.hidden);
}

features.add(
  import.meta.url,
  init,
  'PROD: Hides percent value in the order list.',
);
