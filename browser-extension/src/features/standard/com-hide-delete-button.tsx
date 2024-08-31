import './com-hide-delete-button.css';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

export function init() {
  applyClassCssRule(PrunCss.Message.controls, 'controls');
}

void features.add({
  id: 'com-hide-delete-button',
  init,
});
