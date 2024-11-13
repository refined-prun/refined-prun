import classes from './material-ticker-shadow.module.css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule(C.ColoredIcon.label, classes.shadow);
  applyClassCssRule(C.BuildingIcon.ticker, classes.shadow);
}

features.add(import.meta.url, init, 'Adds a shadow to material tickers.');
