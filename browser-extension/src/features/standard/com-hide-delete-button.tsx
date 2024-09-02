import classes from './com-hide-delete-button.module.css';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

export function init() {
  applyClassCssRule(PrunCss.Message.controls, classes.hide);
}

void features.add({
  id: 'com-hide-delete-button',
  init,
});
