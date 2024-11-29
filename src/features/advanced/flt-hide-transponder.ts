import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import css from '@src/utils/css-utils.module.css';

function init() {
  applyScopedCssRule(['FLT', 'FLTS', 'FLTP'], 'tr > *:first-child', css.hidden);
}

features.add(import.meta.url, init, 'FLT: Hides the "Transponder" column.');
