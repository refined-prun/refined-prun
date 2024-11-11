import classes from './material-icon-bigger-indicator.module.css';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule(PrunCss.MaterialIcon.typeVerySmall, classes.indicator);
}

features.add({
  id: 'material-icon-bigger-indicator',
  description: 'Makes the material count label font bigger.',
  init,
});
