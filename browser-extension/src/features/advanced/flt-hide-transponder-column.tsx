import features from '@src/feature-registry';
import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import css from '@src/utils/css-utils.module.css';

export function init() {
  applyScopedCssRule('FLT', 'tr > *:first-child', css.hidden);
}

void features.add({
  id: 'flt-hide-transponder-column',
  description: 'FLT: Hides the "Transponder" column.',
  advanced: true,
  init,
});
