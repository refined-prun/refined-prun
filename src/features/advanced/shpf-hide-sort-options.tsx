import css from '@src/utils/css-utils.module.css';
import { applyScopedClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyScopedClassCssRule('SHPF', C.InventorySortControls.controls, css.hidden);
}

features.add(import.meta.url, init, 'SHPF: Hides inventory sort options.');
