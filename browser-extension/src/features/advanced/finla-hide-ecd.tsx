import css from '@src/utils/css-utils.module.css';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

export function init() {
  applyScopedCssRule('FINLA', `.${PrunCss.LiquidAssetsPanel.row}:nth-child(4)`, css.hidden);
}

void features.add({
  id: 'finla-hide-ecd',
  advanced: true,
  init,
});
