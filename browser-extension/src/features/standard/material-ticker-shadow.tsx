import classes from './material-ticker-shadow.module.css';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule(PrunCss.ColoredIcon.label, classes.shadow);
}

features.add({
  id: 'material-ticker-shadow',
  description: 'Adds a shadow to material tickers.',
  init,
});
