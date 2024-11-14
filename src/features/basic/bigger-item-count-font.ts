import classes from './bigger-item-count-font.module.css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule(C.MaterialIcon.typeVerySmall, classes.indicator);
}

features.add(import.meta.url, init, 'Makes the item count label font bigger.');
