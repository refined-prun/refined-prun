import features from '@src/feature-registry';
import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import css from '@src/utils/css-utils.module.css';

function init() {
  applyScopedCssRule('CXOS', 'tr > *:first-child', css.hidden);
}

features.add({
  id: 'cxos-hide-exchange-column',
  description: 'CXOS: Hides the "Exchange" column.',
  advanced: true,
  init,
});
