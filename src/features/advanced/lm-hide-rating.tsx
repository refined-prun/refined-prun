import css from '@src/utils/css-utils.module.css';
import classes from './lm-hide-rating.module.css';
import { applyScopedClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyScopedClassCssRule('LM', C.RatingIcon.container, css.hidden);
  applyScopedClassCssRule('LM', C.CommodityAd.text, classes.text);
}

features.add(import.meta.url, init, 'LM: Hides rating icon from ads.');
