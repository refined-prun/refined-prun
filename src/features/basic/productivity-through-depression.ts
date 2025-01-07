import classes from './productivity-through-depression.module.css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule(C.ColoredValue.positive, classes.depression);
}

features.add(import.meta.url, init, "Promitor's finest.");
