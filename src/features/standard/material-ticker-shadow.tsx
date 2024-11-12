import classes from './material-ticker-shadow.module.css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule(PrunCss.ColoredIcon.label, classes.shadow);
}

features.add({
  id: 'material-ticker-shadow',
  description: 'Adds a shadow to material tickers.',
  init,
});
