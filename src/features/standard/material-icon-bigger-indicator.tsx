import classes from './material-icon-bigger-indicator.module.css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule(PrunCss.MaterialIcon.typeVerySmall, classes.indicator);
}

features.add({
  id: 'material-icon-bigger-indicator',
  description: 'Makes the material count label font bigger.',
  init,
});
