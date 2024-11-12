import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import css from '@src/utils/css-utils.module.css';

function init() {
  applyScopedCssRule('CXOS', 'tr > *:first-child', css.hidden);
}

features.add(import.meta.url, init, 'CXOS: Hides the "Exchange" column.');
