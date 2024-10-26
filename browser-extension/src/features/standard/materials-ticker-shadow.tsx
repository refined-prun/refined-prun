import classes from './materials-ticker-shadow.module.css';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule(PrunCss.ColoredIcon.label, classes.shadow);
}

void features.add({
  id: 'materials-ticker-shadow',
  init,
});
