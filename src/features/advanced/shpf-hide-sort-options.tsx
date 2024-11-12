import css from '@src/utils/css-utils.module.css';
import { applyScopedClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyScopedClassCssRule('SHPF', PrunCss.InventorySortControls.controls, css.hidden);
}

features.add({
  id: 'shpf-hide-sort-options',
  description: 'SHPF: Hides inventory sort options.',
  advanced: true,
  init,
});
