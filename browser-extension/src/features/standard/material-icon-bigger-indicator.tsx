import classes from './material-icon-bigger-indicator.module.css';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

export function init() {
  applyClassCssRule(PrunCss.MaterialIcon.indicator, classes.indicator);
}

void features.add({
  id: 'material-icon-bigger-indicator',
  init,
});
